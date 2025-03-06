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

import {
  isHubOrg,
  isXeroSuggestion,
  OrgSelectorProps,
  useOrganizationToBeCreatedOnRegistration,
} from '@app/components/OrgSelector/ANZ/utils'
import { GET_ORGANIZATIONS } from '@app/components/OrgSelector/queries/get-organizations'
import { useAuth } from '@app/context/auth'
import {
  GetOrganizationsQuery,
  GetOrganizationsQueryVariables,
  InsertOrgLeadMutation,
  Organization,
  Dfe_Establishment,
  Organization_Bool_Exp,
} from '@app/generated/graphql'

import { AddOrg as ANZAddOrg } from '../components/ANZ/AddOrg'

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
    allowedOrgCountryCode,
    showOnlyPossibleAffiliatedOrgs = false,
    mainOrgId,
    label,
    createdFrom,
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
      () =>
        Array.from(
          new Set([
            ...(profile?.organizations.map(org => org.organization) ?? []),
            ...(profile?.organizations.flatMap(
              org => org.organization.affiliated_organisations,
            ) ?? []),
          ]),
        ),
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

      const andConditions = [
        allowedOrgCountryCode
          ? {
              address: {
                _contains: {
                  countryCode: `${allowedOrgCountryCode}`,
                },
              },
            }
          : {},
        showOnlyMainOrgs ? { main_organisation_id: { _is_null: true } } : {},
        showOnlyPossibleAffiliatedOrgs
          ? {
              main_organisation_id: { _is_null: true },
              affiliated_organisations_aggregate: {
                count: { predicate: { _eq: 0 } },
              },
            }
          : {},
        mainOrgId ? { id: { _neq: mainOrgId } } : {},
        { _or: orConditions },
      ]

      return { _and: andConditions }
    }, [
      debouncedQuery,
      searchOnlyByPostCode,
      canSearchByAddress,
      allowedOrgCountryCode,
      showOnlyMainOrgs,
      showOnlyPossibleAffiliatedOrgs,
      mainOrgId,
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
      refetchOrganisations({ requestPolicy: 'network-only' })
    }, [refetchOrganisations])

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
      if (!autocompleteMode && !isHubOrg(option)) {
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
      if (!debouncedQuery || orgsFetching) {
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
      hubOrgs?.orgs,
      myOrg,
      onChange,
      orgsFetching,
      showHubResults,
      showTrainerNonAOLOrgs,
      t,
      localSavedOrgToBeCreated,
    ])

    const noOptionsText = useMemo(() => {
      let text = ''

      if (q) {
        if (orgsFetching) text = t('loading')
        else text = t('components.org-selector.no-results')
      } else {
        text = t('components.org-selector.start-typing')
      }

      return <Typography variant="body2">{text}</Typography>
    }, [orgsFetching, q, t])

    function renderAddress(option: Option) {
      if (!isHubOrg(option)) return ''
      const address = option.address ?? {}
      return [
        address.line1,
        address.line2,
        address.city,
        address.postCode,
        address.region,
      ]
        .filter(Boolean)
        .join(', ')
    }
    const organizationCreationOrEnquiryButton = useCallback((): string => {
      return t(allowAdding ? 'create' : 'organisation-enquiry')
    }, [allowAdding, t])
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
          loading={orgsFetching || Boolean(q && !debouncedQuery)}
          disabled={disabled}
          groupBy={(value: Option) => {
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
                    {orgsFetching ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {autocompleteMode ? null : params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              error={!!error}
              helperText={error ?? ''}
            />
          )}
          renderOption={(props, option) => {
            const isNew = !isHubOrg(option) || isXeroSuggestion(option)
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
                      allowAdding
                        ? setAdding(option)
                        : (window.location.href =
                            import.meta.env.VITE_ANZ_ORGANISATION_ENQUIRY)
                    }}
                    size="small"
                    fullWidth={isMobile}
                    data-testid="new-organisation"
                  >
                    {organizationCreationOrEnquiryButton()}
                  </Button>
                ) : null}
              </Box>
            )
          }}
          {...props}
        />
        {adding ? (
          <ANZAddOrg
            orgName={adding.name}
            countryCode={(countryCode as CountryCode) ?? 'AU'}
            onClose={handleClose}
            onSuccess={handleSuccess}
            createdFrom={createdFrom}
          />
        ) : null}
      </>
    )
  }
