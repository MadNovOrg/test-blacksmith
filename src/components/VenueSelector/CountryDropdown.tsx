import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material'
import React, { useMemo } from 'react'
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
}

const CountryDropdown = React.forwardRef(function CountryDropdown(
  props: ICountryDropdownProps,
  ref: React.Ref<HTMLSelectElement>
) {
  const { t } = useScopedTranslation('components.venue-selector.modal.fields')
  const { required, error, errormessage } = props

  const [{ data }] = useQuery<GetCountriesQuery, GetCountriesQueryVariables>({
    query: QUERY_COUNTRIES,
  })

  const options = useMemo(() => {
    return data?.countries.map(country => country.name)
  }, [data])

  return (
    <FormControl fullWidth variant="filled" required={required} error={error}>
      <InputLabel id="country-dropdown" data-testid="country-dropdown">
        {t('country')}
      </InputLabel>
      <Select {...props} id="country-dropdown" ref={ref}>
        {options?.length &&
          options.map(option => (
            <MenuItem
              key={option}
              value={option}
              data-testid={`country-option-${option}`}
            >
              {option}
            </MenuItem>
          ))}
      </Select>
      {error && <FormHelperText>{errormessage}</FormHelperText>}
    </FormControl>
  )
})

export default CountryDropdown
