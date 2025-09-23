// TODO: This component is not used anywhere, check if its still needed
// Comented some things as to not invest time in completely refactoring it
import { Autocomplete, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import {
  SearchXeroContactsQuery,
  SearchXeroContactsQueryVariables,
} from '@app/generated/graphql'
import { SEARCH_XERO_CONTACTS } from '@app/modules/organisation/queries/search-xero-contacts'

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
  React.PropsWithChildren<OrgNameXeroAutocompleteProps>
> = ({ value, onChange }) => {
  const { t } = useTranslation()
  const [hasFocus, setHasFocus] = useState(false)
  const [query, setQuery] = useState<string>('')
  const [{ data, error }] = useQuery<
    SearchXeroContactsQuery,
    SearchXeroContactsQueryVariables
  >({
    query: SEARCH_XERO_CONTACTS,
    variables: { input: { searchTerm: query } },
  })

  const open = hasFocus && (data?.xero?.contacts ?? []).length > 0

  return (
    <Autocomplete
      freeSolo
      disableClearable
      open={open}
      // onClose={() => debouncedXeroContactsQuery.cancel()}
      value={value}
      onChange={(event, data) => onChange(data || undefined)}
      // onInputChange={onOrgNameInputChange}
      options={data?.xero?.contacts ?? []}
      // getOptionLabel={option =>
      //   // typeof option === 'string' ? option : option.name
      // }
      renderInput={params => (
        <TextField
          onChange={e => setQuery(e.target.value)}
          {...params}
          helperText={error?.message}
          error={!!error}
          data-testid="org-name"
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          label={t('pages.create-organization.fields.organization-name')}
          variant="filled"
          sx={{ bgcolor: 'grey.100' }}
          required
          fullWidth
        />
      )}
    />
  )
}
