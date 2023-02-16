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
} from '@mui/material'
import { debounce } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  FindEstablishmentQuery,
  FindEstablishmentQueryVariables,
  GetOrganizationsQuery,
  GetOrganizationsQueryVariables,
  InsertOrgMutation,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY as FindEstablishment } from '@app/queries/dfe/find-establishment'
import { QUERY as GetOrganizations } from '@app/queries/organization/get-organizations'
import { Establishment, Organization } from '@app/types'

import { AddOrg } from './components/AddOrg'

export type OrgSelectorProps = {
  onChange: (org: Organization | null) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
  allowAdding?: boolean
  error?: string
  value?: Pick<Organization, 'name' | 'id'>
  disabled?: boolean
}

type OptionToAdd = Establishment | { name: string }
type Option = Organization | OptionToAdd

const getOptionLabel = (option: Option) => option.name ?? ''

export const OrgSelector: React.FC<React.PropsWithChildren<OrgSelectorProps>> =
  function ({
    onChange,
    sx,
    textFieldProps,
    placeholder,
    allowAdding = false,
    error,
    disabled = false,
    ...props
  }) {
    const { t } = useTranslation()
    const fetcher = useFetcher()
    const { profile } = useAuth()
    const [open, setOpen] = useState(false)
    const [adding, setAdding] = useState<OptionToAdd | null>()
    const [options, setOptions] = useState<Option[]>([])
    const [loading, setLoading] = useState(false)
    const [q, setQ] = useState('')

    const myOrgIds = profile?.organizations.map(org => org.organization.id)

    const refreshOptions = useCallback(
      async (query: string) => {
        const dfeData = await fetcher<
          FindEstablishmentQuery,
          FindEstablishmentQueryVariables
        >(FindEstablishment, { where: { name: { _ilike: `%${query}%` } } })
        const hubData = await fetcher<
          GetOrganizationsQuery,
          GetOrganizationsQueryVariables
        >(GetOrganizations, { where: { name: { _ilike: `%${query}%` } } })
        setLoading(false)
        const orgs = hubData.orgs ?? []
        const establishments = dfeData.establishments ?? []
        const suggestions = establishments.filter(
          e => !orgs.some(org => 'name' in org && org.name === e.name)
        )
        setOptions([
          ...orgs,
          ...(allowAdding ? [{ name: query }] : []),
          ...suggestions,
        ])
      },
      [allowAdding, fetcher]
    )

    const debouncedQuery = useMemo(() => {
      return debounce(async query => refreshOptions(query), 1000)
    }, [refreshOptions])

    const onInputChange = useCallback(
      async (event: React.SyntheticEvent, value: string, reason: string) => {
        setQ(value)
        setOptions([])
        if (reason === 'input' && value && value.length > 2) {
          setLoading(true)
          debouncedQuery(value)
        }
      },
      [debouncedQuery]
    )

    const handleClose = () => setAdding(null)

    const handleSuccess = async (org: InsertOrgMutation['org']) => {
      if (!org) return

      setAdding(null)
      await refreshOptions(org.name)

      // TODO: Not auto selecting the newly added org, needs fixing
      onChange(org as unknown as Organization)
    }

    const handleChange = (
      event: React.SyntheticEvent,
      option: Option | null
    ) => {
      event.preventDefault()

      if (option && (!('id' in option) || 'urn' in option)) {
        return setTimeout(() => setAdding(option))
      }

      onChange(option)
    }

    const noOptionsText =
      q.length < 3 ? (
        t('components.org-selector.min-chars')
      ) : (
        <Typography variant="body2">
          {loading ? t('loading') : t('components.org-selector.no-results')}
        </Typography>
      )

    function renderAddress(option: Option) {
      if (!('id' in option) || !('name' in option)) return ''
      const address =
        'urn' in option
          ? {
              line1: option.addressLineOne,
              line2: option.addressLineTwo,
              city: option.town,
              postCode: option.postcode,
            }
          : option.address
      return [address.line1, address.line2, address.city, address.postCode]
        .filter(Boolean)
        .join(', ')
    }

    return (
      <>
        <Autocomplete
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          data-testid="org-selector"
          sx={sx}
          openOnFocus
          clearOnBlur={false}
          onInputChange={onInputChange}
          onChange={handleChange}
          options={options}
          getOptionLabel={getOptionLabel}
          noOptionsText={noOptionsText}
          isOptionEqualToValue={(o, v) => {
            if (!('id' in v) || !('id' in o)) return false
            return o.id === v.id
          }}
          loading={loading}
          disabled={disabled}
          groupBy={(value: Option) => {
            if ('urn' in value) {
              return t('components.org-selector.dfe-suggestions')
            }
            if ('id' in value) {
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
              <Grid container justifyContent="space-between" px={2} py={1}>
                <Typography display="inline" variant="body2">
                  {params.group}
                </Typography>
              </Grid>
              <List sx={{ px: 2 }}>{params.children}</List>
            </li>
          )}
          renderInput={params => (
            <TextField
              {...textFieldProps}
              {...params}
              placeholder={
                placeholder ?? t('components.org-selector.placeholder')
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              error={!!error}
              helperText={error || ''}
            />
          )}
          renderOption={(props, option) => {
            const isNew = !('id' in option) || 'urn' in option
            const address = renderAddress(option)

            return (
              <Box
                display="flex"
                justifyContent="space-between"
                px={2}
                component="li"
                {...props}
                {...(isNew
                  ? {
                      onClick: undefined,
                      onTouchStart: undefined,
                    }
                  : {})}
                key={'id' in option ? option.id : 'NEW_ORG'}
                data-testid={`org-selector-result-${
                  'id' in option ? option.id : 'NEW_ORG'
                }`}
              >
                <Typography
                  flex={1}
                  pr={2}
                  fontStyle={isNew && !('urn' in option) ? 'italic' : undefined}
                  component="span"
                  display="flex"
                  alignItems="center"
                >
                  {getOptionLabel(option)}
                  <Typography variant="body2" color="grey.700" ml={1}>
                    {address}
                  </Typography>
                </Typography>
                {isNew ? (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setAdding(option)}
                    size="small"
                  >
                    {t('urn' in option ? 'add' : 'create')}
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
