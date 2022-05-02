import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'

import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/organization/get-organizations'
import { Organization } from '@app/types'
import { normalizeAddr } from '@app/util'

import { AddOrg } from './components/AddOrg'

export type OrgSelectorProps = {
  onChange: (org: Organization) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
  allowAdding?: boolean
  error?: string
  value?: Organization
}

const getOptionLabel = (option: Organization) => option.name || ''

export const OrgSelector: React.FC<OrgSelectorProps> = function ({
  onChange,
  sx,
  textFieldProps,
  placeholder,
  allowAdding = false,
  error,
  ...props
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState<string | null>(null)
  const [q] = useDebounce(query, 300)
  const shouldSearch = q.trim().length > 0

  const {
    data,
    error: searchError,
    mutate,
  } = useSWR<ResponseType, Error, [string, ParamsType] | null>(
    shouldSearch ? [QUERY, { name: q?.length >= 2 ? `%${q}%` : q }] : null
  )
  const loading = !data && !searchError && shouldSearch

  const handleClose = () => setAdding(null)

  const handleSuccess = (org: Organization) => {
    setAdding(null)
    setQuery(org.name)
    mutate()

    // TODO: Not auto selecting the newly added org, needs fixing
    onChange(org)
  }

  const handleChange = (
    event: React.SyntheticEvent,
    org: Organization | string | null
  ) => {
    event.preventDefault()

    if (!org || typeof org === 'string') return

    if (org.id === 'NEW_ORG') {
      return setTimeout(() => setAdding(org.name))
    }

    onChange(org)
  }

  const noOptionsText =
    query.length < 2 ? (
      t('components.org-selector.min-chars')
    ) : (
      <Typography variant="body2">
        {loading ? t('loading') : t('components.org-selector.no-results')}
      </Typography>
    )

  const options = useMemo<Organization[]>(() => {
    const orgs = data?.orgs || []
    const searchedOrg = query.trim().toLowerCase()
    const hasExactMatch = orgs.find(o => o.name.toLowerCase() === searchedOrg)

    return orgs.concat(
      allowAdding && searchedOrg.length && !hasExactMatch && !loading
        ? ({ id: 'NEW_ORG', name: query } as Organization)
        : []
    )
  }, [data, query, allowAdding, loading])

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
        onInputChange={(_, v) => setQuery(v)}
        onChange={handleChange}
        options={options || []}
        getOptionLabel={getOptionLabel}
        noOptionsText={noOptionsText}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        loading={loading}
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
          const isNew = option.id === 'NEW_ORG'
          const addr = normalizeAddr(option.addresses?.[0])

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
              key={option.id}
            >
              <Typography
                flex={1}
                pr={2}
                fontStyle={isNew ? 'italic' : undefined}
                component="span"
                display="flex"
                alignItems="center"
              >
                {getOptionLabel(option)}
                {addr && (
                  <Typography variant="body2" color="grey.700" ml={1}>
                    ({addr.join(', ')})
                  </Typography>
                )}
              </Typography>
              {isNew ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setAdding(q)}
                  size="small"
                >
                  {t('add')}
                </Button>
              ) : null}
            </Box>
          )
        }}
        {...props}
      />
      {adding ? (
        <AddOrg name={adding} onClose={handleClose} onSuccess={handleSuccess} />
      ) : null}
    </>
  )
}
