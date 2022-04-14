import {
  Autocomplete,
  CircularProgress,
  SxProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { debounce } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { gqlRequest } from '@app/lib/gql-request'
import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/organization/get-organizations'
import { Organization } from '@app/types'

export type OrgSelectorProps = {
  value?: Organization
  onChange: (value: Organization | undefined) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
  placeholder?: string
}

export const OrgSelector: React.FC<OrgSelectorProps> = function ({
  value,
  onChange,
  sx,
  textFieldProps,
  placeholder,
  ...props
}) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(value)
  const [options, setOptions] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const debouncedQuery = useMemo(
    () =>
      debounce(async query => {
        const results = await gqlRequest<ResponseType, ParamsType>(QUERY, {
          name: query,
        })

        setLoading(false)

        if (results.orgs) {
          setOptions(results.orgs)
        }
      }),
    []
  )

  const handleInputChange = (_: unknown, value: string, reason: string) => {
    if (reason === 'input' && value && value.length >= 2) {
      setLoading(true)
      setOptions([])

      debouncedQuery(`%${value}%`)
    }

    setQuery(value)
  }

  const noOptionsText =
    query.length < 2
      ? t('components.org-selector.min-chars')
      : t('components.org-selector.no-results')

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false)
        setLoading(false)
        debouncedQuery.cancel()
      }}
      data-testid="org-selector"
      sx={sx}
      value={selected}
      openOnFocus
      clearOnBlur={false}
      onInputChange={handleInputChange}
      onChange={(_, newValue) => {
        if (value) {
          setSelected(newValue ?? undefined)
        }
        onChange(newValue ?? undefined)
      }}
      options={options}
      getOptionLabel={option => option.name || ''}
      noOptionsText={noOptionsText}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      loading={loading}
      disableClearable={true}
      renderInput={params => (
        <TextField
          {...textFieldProps}
          {...params}
          placeholder={placeholder ?? t('components.org-selector.placeholder')}
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
        />
      )}
      {...props}
    />
  )
}
