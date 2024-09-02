import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { CountryCode } from 'libphonenumber-js'
import { uniqBy, uniqueId } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'
import { useDebounce } from 'use-debounce'

import { FIND_ESTABLISHMENTS } from '@app/components/OrgSelector/queries/find-establishment'
import { GET_ORGANIZATIONS } from '@app/components/OrgSelector/queries/get-organizations'
import {
  isDfeSuggestion,
  isHubOrg,
  isXeroSuggestion,
  OrgSelectorProps,
  useOrganizationToBeCreatedOnRegistration,
} from '@app/components/OrgSelector/utils'
import { useAuth } from '@app/context/auth'
import {
  FindEstablishmentQuery,
  FindEstablishmentQueryVariables,
  GetOrganizationsQuery,
  GetOrganizationsQueryVariables,
  InsertOrgLeadMutation,
  Organization,
  Dfe_Establishment,
  Organization_Bool_Exp,
} from '@app/generated/graphql'
import { organizationData as localStateOrganization } from '@app/util'

import { AddOrg } from './components/AddOrg'
type OptionToAdd = Dfe_Establishment | { id?: string; name: string }
type Option = Organization | OptionToAdd

const getOptionLabel = (option: Option) => option.name ?? ''
export const OrgSelector: React.FC<React.PropsWithChildren<OrgSelectorProps>> =
  function ({
    value,
    showTrainerOrgOnly = false,
    onChange,
    onInputChange,
    sx,
    textFieldProps,
    placeholder,
    autocompleteMode = false,
    allowAdding = false,
    showHubResults = true,
    showDfeResults = true,
    error,
    disabled = false,
    required = false,
    isShallowRetrieval = false,
    isEditProfile,
    userOrgIds,
    countryCode,
    searchOnlyByPostCode = false,
    canSearchByAddress = true,
    showOnlyMainOrgs = false,
    label,
    ...props
  }) {
    const { t } = useTranslation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { profile } = useAuth()
    const [open, setOpen] = useState(false)
    const [adding, setAdding] = useState<OptionToAdd | null>()
    const [q, setQ] = useState('')
    const [debouncedQuery] = useDebounce(q, 300)
    const localSavedOrgToBeCreated = useOrganizationToBeCreatedOnRegistration()

    useEffect(() => {
      if (q) setOpen(true)
    }, [q])

    const orgIds =
      userOrgIds ?? profile?.organizations.map(org => org.organization.id)

    const myOrg = useMemo(
      () => profile?.organizations.map(org => org.organization),
      [profile?.organizations],
    )
    const showTrainerNonAOLOrgs: boolean = showTrainerOrgOnly && !!profile
    const defaultOrg = useMemo(
      () =>
        showTrainerOrgOnly && profile?.organizations.length === 1
          ? profile?.organizations[0]?.organization
          : undefined,
      [profile?.organizations, showTrainerOrgOnly],
    )

    const [{ data: dfeOrgs, fetching: dfeFetching }, refetchDfeEstablishment] =
      useQuery<FindEstablishmentQuery, FindEstablishmentQueryVariables>({
        query: FIND_ESTABLISHMENTS,
        variables: {
          where: {
            _and: [
              ...(searchOnlyByPostCode
                ? [
                    {
                      searchPostCode: {
                        _ilike: `%${debouncedQuery.replace(/\s/g, '')}%`,
                      },
                    },
                  ]
                : [
                    {
                      _and: debouncedQuery
                        .trim()
                        .split(/\s+/)
                        .map(word => ({
                          name: { _ilike: `%${word}%` },
                        })),
                    },
                  ]),

              { registered: { _eq: false } },

              ...(localStateOrganization?.dfeId
                ? [{ id: { _neq: localStateOrganization.dfeId } }]
                : []),
            ],
          },
        },
        pause: !debouncedQuery,
      })

    const where = useMemo<Organization_Bool_Exp>(() => {
      const orConditions = []

      orConditions.push({
        postCode: { _ilike: `%${debouncedQuery.replace(/\s/g, '')}%` },
      })

      if (searchOnlyByPostCode) return { _or: orConditions }

      orConditions.push({
        _and: debouncedQuery
          .trim()
          .split(/\s+/)
          .map(word => ({
            name: { _ilike: `%${word}%` },
          })),
      })

      if (canSearchByAddress) {
        const address = debouncedQuery
          .trim()
          .split(/\s+/)
          .map(word => ({
            addressEachText: { _ilike: `%${word}%` },
          }))

        orConditions.push({ _and: address })
      }

      if (showOnlyMainOrgs) {
        return {
          _and: [
            { _or: orConditions },
            { main_organisation_id: { _is_null: true } },
          ],
        }
      }
      return { _or: orConditions }
    }, [
      debouncedQuery,
      searchOnlyByPostCode,
      canSearchByAddress,
      showOnlyMainOrgs,
    ])

    const [{ data: hubOrgs, fetching: orgsFetching }, refetchOrganisations] =
      useQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>({
        query: GET_ORGANIZATIONS,
        variables: {
          where,
          isNotShallow: !isShallowRetrieval,
          isShallow: isShallowRetrieval,
        },
        pause: !debouncedQuery,
      })

    const refetchAllOrganisations = useCallback(() => {
      refetchDfeEstablishment({ requestPolicy: 'network-only' })
      refetchOrganisations({ requestPolicy: 'network-only' })
    }, [refetchDfeEstablishment, refetchOrganisations])

    const handleClose = () => setAdding(null)
    const handleSuccess = async (org: InsertOrgLeadMutation['org']) => {
      if (!org) return
      setAdding(null)

      onChange(org)

      refetchAllOrganisations()
    }
    const handleChange = (
      event: React.SyntheticEvent,
      option: Option | null,
    ) => {
      event.preventDefault()
      if (!autocompleteMode && (!isHubOrg(option) || isDfeSuggestion(option))) {
        return setTimeout(() => setAdding(option))
      }
      if (autocompleteMode && isXeroSuggestion(option)) {
        onChange({
          name: option.name,
          xeroId:
            'contactID' in option ? (option.contactID as string) : undefined,
        })
      } else {
        onChange(option)
      }
    }

    const options = useMemo(() => {
      if (showTrainerNonAOLOrgs) {
        if (defaultOrg) onChange(defaultOrg)
        return myOrg as Option[]
      }
      if (!debouncedQuery || orgsFetching || dfeFetching) {
        return []
      }
      return uniqBy(
        [
          ...(localSavedOrgToBeCreated?.name
            .toLowerCase()
            .includes(debouncedQuery.toLowerCase())
            ? [{ ...localSavedOrgToBeCreated, id: uniqueId() }]
            : []),
          ...(showHubResults ? hubOrgs?.orgs ?? [] : []),
          ...(showDfeResults ? dfeOrgs?.establishments ?? [] : []),
          ...(allowAdding && !autocompleteMode && debouncedQuery
            ? [{ name: debouncedQuery }]
            : []),
          ...(!allowAdding
            ? [{ name: t('components.org-selector.request-creation-sub') }]
            : []),
        ],
        'id',
      )
    }, [
      allowAdding,
      autocompleteMode,
      debouncedQuery,
      defaultOrg,
      dfeFetching,
      dfeOrgs?.establishments,
      hubOrgs?.orgs,
      myOrg,
      onChange,
      orgsFetching,
      showDfeResults,
      showHubResults,
      showTrainerNonAOLOrgs,
      t,
      localSavedOrgToBeCreated,
    ])

    const noOptionsText = useMemo(() => {
      let text = ''

      if (q) {
        if (dfeFetching || orgsFetching) text = t('loading')
        else text = t('components.org-selector.no-results')
      } else {
        text = t('components.org-selector.start-typing')
      }

      return <Typography variant="body2">{text}</Typography>
    }, [dfeFetching, orgsFetching, q, t])

    function renderAddress(option: Option) {
      if (!isHubOrg(option) && !isDfeSuggestion(option)) return ''
      const address = isDfeSuggestion(option)
        ? {
            line1: option.addressLineOne,
            line2: option.addressLineTwo,
            city: option.town,
            postCode: option.postcode,
          }
        : option.address ?? {}
      return [address.line1, address.line2, address.city, address.postCode]
        .filter(Boolean)
        .join(', ')
    }
    const organizationCreationOrEnquiryButton = useCallback(
      (option: Option): string => {
        if (isDfeSuggestion(option)) {
          return t('add')
        }
        return t(allowAdding ? 'create' : 'organisation-enquiry')
      },
      [allowAdding, t],
    )

    return (
      <>
        <Autocomplete
          defaultValue={defaultOrg}
          value={!value ? null : value}
          open={open}
          onOpen={() => {
            if (
              (showTrainerNonAOLOrgs && myOrg?.length) ||
              localSavedOrgToBeCreated
            ) {
              setOpen(true)
            }
          }}
          onClose={() => setOpen(false)}
          data-testid="org-selector"
          sx={sx}
          openOnFocus
          clearOnBlur={false}
          onChange={handleChange}
          onInputChange={
            onInputChange ? (_, value) => onInputChange(value) : undefined
          }
          options={options}
          filterOptions={
            !showTrainerOrgOnly
              ? options =>
                  isEditProfile
                    ? options.filter(option => !orgIds?.includes(option.id))
                    : options
              : undefined
          }
          getOptionLabel={getOptionLabel}
          noOptionsText={noOptionsText}
          isOptionEqualToValue={(o, v) => {
            if (!('id' in v) || !('id' in o)) return false
            return o.id === v.id
          }}
          loading={dfeFetching || orgsFetching || Boolean(q && !debouncedQuery)}
          disabled={disabled}
          groupBy={(value: Option) => {
            if (isDfeSuggestion(value)) {
              return t('components.org-selector.dfe-suggestions')
            }
            if (isXeroSuggestion(value)) {
              return t('components.org-selector.tt-suggestions')
            }
            if (isHubOrg(value)) {
              return orgIds?.includes(value.id)
                ? t('components.org-selector.my-organizations')
                : t('components.org-selector.existing-organizations')
            } else {
              return t(
                allowAdding
                  ? 'components.org-selector.add-manually'
                  : 'components.org-selector.request-creation',
              )
            }
          }}
          renderGroup={params => (
            <li
              key={params.key}
              data-testid={`org-selector-result-group-${params.group}`}
            >
              <Grid container justifyContent="space-between" p={2} py={1}>
                <Typography
                  display="inline"
                  variant="body2"
                  fontWeight={isMobile ? 700 : 300}
                >
                  {params.group}
                </Typography>
              </Grid>
              <List sx={{ p: 0, justifyContent: 'space-between' }}>
                {params.children}
              </List>
            </li>
          )}
          renderInput={params => (
            <TextField
              {...textFieldProps}
              {...params}
              data-testid="org-name"
              label={
                label ??
                (searchOnlyByPostCode
                  ? t('components.org-selector.residing-org')
                  : t('components.org-selector.title'))
              }
              InputLabelProps={{
                shrink: true,
                required,
              }}
              onChange={e => setQ(e.target.value)}
              placeholder={
                placeholder ??
                (searchOnlyByPostCode
                  ? t('components.org-selector.post-code-placeholder')
                  : t('components.org-selector.placeholder'))
              }
              InputProps={{
                ...params.InputProps,

                endAdornment: (
                  <React.Fragment>
                    {dfeFetching || orgsFetching ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {autocompleteMode ? null : params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              error={!!error}
              helperText={error || ''}
            />
          )}
          renderOption={(props, option) => {
            const isNew =
              !isHubOrg(option) ||
              isXeroSuggestion(option) ||
              isDfeSuggestion(option)
            const address = renderAddress(option)
            const key = !('id' in option) ? 'NEW_ORG' : (option?.id as string)

            return (
              <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                px={2}
                component="li"
                {...props}
                {...(isNew && !autocompleteMode
                  ? {
                      onClick: undefined,
                      onTouchStart: undefined,
                    }
                  : {})}
                key={key}
                data-testid={`org-selector-result-${key}`}
              >
                <Typography
                  flex={1}
                  p={1}
                  fontStyle={isNew ? 'italic' : undefined}
                  component="span"
                  display="flex"
                  flexDirection={isMobile ? 'column' : 'row'}
                  alignItems={isMobile ? 'left' : 'center'}
                >
                  {getOptionLabel(option)}
                  <Typography variant="body2" color="grey.700" ml={1}>
                    {address}
                  </Typography>
                </Typography>
                {isNew && !autocompleteMode ? (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      if (!isDfeSuggestion(option) && !allowAdding) {
                        window.location.href =
                          import.meta.env.VITE_ORGANISATION_ENQUIRY
                        return
                      }
                      setAdding(option)
                    }}
                    size="small"
                    fullWidth={isMobile}
                    data-testid="new-organisation"
                  >
                    {organizationCreationOrEnquiryButton(option)}
                  </Button>
                ) : null}
              </Box>
            )
          }}
          {...props}
        />
        {adding ? (
          <AddOrg
            option={adding}
            countryCode={(countryCode as CountryCode) ?? 'GB-ENG'}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        ) : null}
      </>
    )
  }
