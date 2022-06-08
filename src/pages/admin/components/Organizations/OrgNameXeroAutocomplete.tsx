import { Autocomplete, TextField } from '@mui/material'
import { debounce } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  ParamsType as SearchXeroContactsParamsType,
  QUERY as SearchXeroContactsQuery,
  ResponseType as SearchXeroContactsResponseType,
} from '@app/queries/xero/search-xero-contacts'

type OrgNameXeroAutocompleteProps = {
  value: string
  onChange: (value?: XeroContact | string) => void
  error?: string
}

type XeroContact = {
  name: string
  contactID: string
}

export const OrgNameXeroAutocomplete: React.FC<
  OrgNameXeroAutocompleteProps
> = ({ value, onChange, error }) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [suggestions, setSuggestions] = useState<XeroContact[]>([])
  const [internalError, setInternalError] = useState<string>()
  const [hasFocus, setHasFocus] = useState(false)

  const debouncedXeroContactsQuery = useMemo(() => {
    return debounce(async query => {
      try {
        setSuggestions([])
        const response = await fetcher<
          SearchXeroContactsResponseType,
          SearchXeroContactsParamsType
        >(SearchXeroContactsQuery, {
          input: {
            searchTerm: query,
          },
        })
        setSuggestions(response.xero.contacts)
      } catch (e: unknown) {
        setInternalError((e as Error).message)
      }
    })
  }, [fetcher])

  const onOrgNameInputChange = useCallback(
    async (event: React.SyntheticEvent, value: string, reason: string) => {
      if (reason === 'input' && value) {
        debouncedXeroContactsQuery(value)
      }
      onChange(value)
    },
    [debouncedXeroContactsQuery, onChange]
  )

  const open = hasFocus && suggestions.length > 0
  const err = [error, internalError].filter(Boolean).join('\n')

  return (
    <Autocomplete
      freeSolo
      disableClearable
      open={open}
      onClose={() => debouncedXeroContactsQuery.cancel()}
      value={value}
      onChange={(event, data) => onChange(data || undefined)}
      onInputChange={onOrgNameInputChange}
      options={suggestions}
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.name
      }
      renderInput={params => (
        <TextField
          {...params}
          helperText={err}
          error={!!err}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          label={t('pages.create-organization.fields.organization-name')}
          variant="standard"
          sx={{ bgcolor: 'grey.100' }}
          required
          fullWidth
        />
      )}
    />
  )
}
