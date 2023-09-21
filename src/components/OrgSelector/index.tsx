import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import {
  isDfeSuggestion,
  isHubOrg,
  isXeroSuggestion,
} from '@app/components/OrgSelector/utils'
import { useAuth } from '@app/context/auth'
import {
  FindEstablishmentQuery,
  FindEstablishmentQueryVariables,
  GetOrganizationsQuery,
  GetOrganizationsQueryVariables,
  GetShallowOrganizationsQuery,
  GetShallowOrganizationsQueryVariables,
  InsertOrgMutation,
  Dfe_Establishment_Bool_Exp,
  Organization_Bool_Exp,
} from '@app/generated/graphql'
import { QUERY as FindEstablishment } from '@app/queries/dfe/find-establishment'
import { QUERY as GetOrganizations } from '@app/queries/organization/get-organizations'
import { QUERY as GetShallowOrganizations } from '@app/queries/organization/get-shallow-organizations'
import { Establishment, Organization } from '@app/types'

import { AddOrg } from './components/AddOrg'

type OptionToAdd = Establishment | { name: string }
type Option = Organization | OptionToAdd

export type SuggestionOption = {
  name: string
  xeroId?: string
}
export type CallbackOption =
  | Organization
  | Establishment
  | SuggestionOption
  | null

export type OrgSelectorProps = {
  onChange: (org: CallbackOption) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
  allowAdding?: boolean
  error?: string
  value?: Pick<Organization, 'name' | 'id'>
  disabled?: boolean
  required?: boolean
  showHubResults?: boolean
  showDfeResults?: boolean
  autocompleteMode?: boolean
  showTrainerOrgOnly?: boolean
  isShallowRetrieval?: boolean
}

const getOptionLabel = (option: Option) => option.name ?? ''

export const OrgSelector: React.FC<React.PropsWithChildren<OrgSelectorProps>> =
  function ({
    showTrainerOrgOnly = false,
    onChange,
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
    ...props
  }) {
    const { t } = useTranslation()

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const { profile } = useAuth()
    const [open, setOpen] = useState(false)
    const [adding, setAdding] = useState<OptionToAdd | null>()
    const [options, setOptions] = useState<Option[]>([])
    const [q, setQ] = useState('')
    const [queryVariable, setQueryVariable] = useState<
      Dfe_Establishment_Bool_Exp | Organization_Bool_Exp
    >()
    const [exectureQuery, setExecuteQuery] = useState<{
      pauseDfeQuery: boolean
      pauseShallowOrgDataQuery: boolean
      pauseOrgDataQuery: boolean
    }>({
      pauseDfeQuery: true,
      pauseShallowOrgDataQuery: true,
      pauseOrgDataQuery: true,
    })

    const myOrgIds = profile?.organizations.map(org => org.organization.id)

    const myOrg = useMemo(
      () => profile?.organizations.map(org => org.organization),
      [profile?.organizations]
    )

    const showTrainerNonAOLOrgs: boolean = showTrainerOrgOnly && !!profile

    const defaultOrg = useMemo(
      () =>
        showTrainerOrgOnly && profile?.organizations.length === 1
          ? profile?.organizations[0]?.organization
          : undefined,
      [profile?.organizations, showTrainerOrgOnly]
    )

    const [{ data: dfeData }] = useQuery<
      FindEstablishmentQuery,
      FindEstablishmentQueryVariables
    >({
      query: FindEstablishment,
      variables: { where: queryVariable as Dfe_Establishment_Bool_Exp },
      pause: exectureQuery.pauseDfeQuery,
    })

    const [{ data: shallowOrgData, fetching: shallowOrgDataFetching }] =
      useQuery<
        GetShallowOrganizationsQuery,
        GetShallowOrganizationsQueryVariables
      >({
        query: GetShallowOrganizations,
        variables: { where: queryVariable as Organization_Bool_Exp },
        pause: exectureQuery.pauseShallowOrgDataQuery,
      })

    const [{ data: orgData, fetching: orgDatFetching }] = useQuery<
      GetOrganizationsQuery,
      GetOrganizationsQueryVariables
    >({
      query: GetOrganizations,
      variables: { where: queryVariable as Organization_Bool_Exp },
      pause: exectureQuery.pauseOrgDataQuery,
    })

    const orgs = isShallowRetrieval ? shallowOrgData?.orgs : orgData?.orgs

    const establishments = dfeData?.establishments
    const dfeResults = establishments
      ?.filter(
        establishment =>
          !orgs?.some(org => 'name' in org && org.name === establishment.name)
      )
      .map(r => ({
        ...r,
        fromDfe: true,
      }))

    useEffect(() => {
      if (showTrainerNonAOLOrgs) {
        setOptions(() => myOrg as Organization[])

        if (defaultOrg) onChange(defaultOrg)
        return
      }

      setOptions(() => [])
    }, [defaultOrg, myOrg, onChange, showTrainerNonAOLOrgs])

    const refreshOptions = useCallback(
      (query: string) => {
        const keywords = (query ?? '').split(' ')
        const condition = {
          _and: keywords.map(k => ({ name: { _ilike: `%${k}%` } })),
        }
        setQueryVariable(condition)
        setExecuteQuery(() => {
          if (isShallowRetrieval) {
            return {
              pauseOrgDataQuery: true,
              pauseShallowOrgDataQuery: false,
              pauseDfeQuery: false,
            }
          } else {
            return {
              pauseOrgDataQuery: false,
              pauseShallowOrgDataQuery: true,
              pauseDfeQuery: false,
            }
          }
        })

        setOptions([
          ...(showHubResults && orgs ? orgs : []),
          ...(allowAdding && !autocompleteMode ? [{ name: query }] : []),
          ...(showDfeResults && dfeResults ? dfeResults : []),
        ])
      },
      [
        setQueryVariable,
        showHubResults,
        orgs,
        allowAdding,
        autocompleteMode,
        showDfeResults,
        dfeResults,
        isShallowRetrieval,
      ]
    )

    const debouncedQuery = useMemo(() => {
      return debounce(async query => refreshOptions(query), 1000)
    }, [refreshOptions])

    const onInputChange = useCallback(
      async (event: React.SyntheticEvent, value: string, reason: string) => {
        setQ(value)
        setOptions([])
        if (reason === 'input' && value && value.length > 2) {
          debouncedQuery(value)
        }
        if (autocompleteMode) {
          onChange(value ? { name: value } : null)
        }
      },
      [autocompleteMode, debouncedQuery, onChange]
    )

    const handleClose = () => setAdding(null)

    const handleSuccess = async (org: InsertOrgMutation['org']) => {
      if (!org) return

      setAdding(null)
      await refreshOptions(org.name)

      // TODO: Not auto selecting the newly added org, needs fixing
      onChange(org)
    }

    const handleChange = (
      event: React.SyntheticEvent,
      option: Option | null
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

    const noOptionsText =
      showTrainerNonAOLOrgs && !myOrg?.length ? (
        <Typography variant="body2">
          {shallowOrgDataFetching || orgDatFetching
            ? t('loading')
            : t('components.org-selector.no-results')}
        </Typography>
      ) : q.length < 3 ? (
        t('components.org-selector.min-chars')
      ) : (
        <Typography variant="body2">
          {shallowOrgDataFetching || orgDatFetching
            ? t('loading')
            : t('components.org-selector.no-results')}
        </Typography>
      )

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

    return (
      <>
        <Autocomplete
          defaultValue={defaultOrg}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          data-testid="org-selector"
          sx={sx}
          openOnFocus
          clearOnBlur={false}
          onInputChange={!showTrainerOrgOnly ? onInputChange : undefined}
          onChange={handleChange}
          options={options}
          filterOptions={!showTrainerOrgOnly ? options => options : undefined}
          getOptionLabel={getOptionLabel}
          noOptionsText={noOptionsText}
          isOptionEqualToValue={(o, v) => {
            if (!('id' in v) || !('id' in o)) return false
            return o.id === v.id
          }}
          loading={shallowOrgDataFetching || orgDatFetching}
          disabled={disabled}
          groupBy={(value: Option) => {
            if (isDfeSuggestion(value)) {
              return t('components.org-selector.dfe-suggestions')
            }
            if (isXeroSuggestion(value)) {
              return t('components.org-selector.tt-suggestions')
            }
            if (isHubOrg(value)) {
              return myOrgIds?.includes(value.id)
                ? t('components.org-selector.my-organizations')
                : t('components.org-selector.existing-organizations')
            } else {
              return t('components.org-selector.add-manually')
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
              label={t('components.org-selector.title')}
              InputLabelProps={{
                shrink: true,
                required,
              }}
              placeholder={
                placeholder ?? t('components.org-selector.placeholder')
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {shallowOrgDataFetching || orgDatFetching ? (
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
            const key = !('id' in option) ? 'NEW_ORG' : (option.id as string)

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
                    onClick={() => setAdding(option)}
                    size="small"
                    fullWidth={isMobile}
                  >
                    {t(isDfeSuggestion(option) ? 'add' : 'create')}
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
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        ) : null}
      </>
    )
  }
