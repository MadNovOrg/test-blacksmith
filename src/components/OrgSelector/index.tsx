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
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'

import { gqlRequest } from '@app/lib/gql-request'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/organization/get-organizations'
import { Organization } from '@app/types'

import { AddOrg } from './components/AddOrg'

export type OrgSelectorProps = {
  onChange: (value: string | null) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
  allowAdding?: boolean
  error?: string
}

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
  const [queryDebounced] = useDebounce(query, 300)

  const {
    data,
    error: searchError,
    mutate,
  } = useSWR<ResponseType, Error, [string, ParamsType]>(
    [
      QUERY,
      {
        name:
          queryDebounced?.length >= 2 ? `%${queryDebounced}%` : queryDebounced,
      },
    ],
    gqlRequest
  )
  const loading = !data && !searchError

  const handleClose = () => setAdding(null)

  const handleSuccess = (id: string, name: string) => {
    setAdding(null)
    setQuery(name)
    mutate()

    // TODO: Not auto selecting the newly added org, needs fixing
    onChange(id)
  }

  const handleInputChange = (_: unknown, value: string) => {
    setQuery(value)
  }

  const handleChange = (
    event: React.SyntheticEvent,
    org: Organization | string | null
  ) => {
    if (typeof org === 'string') {
      // timeout to avoid instant validation of the dialog's form.
      setTimeout(() => {
        setAdding(org)
      })
    } else {
      onChange(org?.id ?? null)
    }
  }

  const noOptionsText =
    query.length < 2 ? (
      t('components.org-selector.min-chars')
    ) : (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {loading ? t('loading') : t('components.org-selector.no-results')}
        </Typography>
        {!loading && allowAdding && (
          <Button
            color="primary"
            variant="contained"
            onClick={() => setAdding(queryDebounced)}
          >
            {t('add')}
          </Button>
        )}
      </Box>
    )

  const options = data?.orgs

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
        onInputChange={handleInputChange}
        onChange={handleChange}
        options={options || []}
        getOptionLabel={option => option.name || ''}
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
        {...props}
      />
      {adding ? (
        <AddOrg name={adding} onClose={handleClose} onSuccess={handleSuccess} />
      ) : null}
    </>
  )
}
