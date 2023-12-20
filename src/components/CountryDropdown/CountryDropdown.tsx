import { MenuItem, TextField } from '@mui/material'
import React, { useMemo } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { useQuery } from 'urql'

import {
  GetCountriesQuery,
  GetCountriesQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { Query as QUERY_COUNTRIES } from '@app/queries/country/get-countries'

interface ICountryDropdownProps {
  required: boolean
  error: boolean
  errormessage?: string
  label?: string
  value: string | null
  register: UseFormRegisterReturn
}

export const CountryDropdown = React.forwardRef(function CountryDropdown(
  props: ICountryDropdownProps
) {
  const { t } = useScopedTranslation('components.venue-selector.modal.fields')
  const { required, error, errormessage, label } = props

  const [{ data }] = useQuery<GetCountriesQuery, GetCountriesQueryVariables>({
    query: QUERY_COUNTRIES,
  })

  const options = useMemo(() => {
    return data?.countries.map(country => country.name)
  }, [data])

  return (
    <TextField
      sx={{ bgcolor: 'grey.100' }}
      select
      fullWidth
      variant="filled"
      required={required}
      error={error}
      helperText={errormessage}
      label={label ?? t('country')}
      {...props.register}
      value={props.value}
      defaultValue={props.value}
    >
      {options?.length ? (
        options.map(option => (
          <MenuItem
            key={option}
            value={option}
            data-testid={`country-option-${option}`}
          >
            {option}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          {t('country')}
        </MenuItem>
      )}
    </TextField>
  )
})
