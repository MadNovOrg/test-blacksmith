import {
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import {
  GetCountriesQuery,
  GetCountriesQueryVariables,
} from '@app/generated/graphql'
import { Query as QUERY_COUNTRIES } from '@app/queries/country/get-countries'

type SelectValue = string | null

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  usesAOL: boolean
  error?: boolean
  required?: boolean
}

export const CourseAOLCountryDropdown: React.FC<
  React.PropsWithChildren<Props>
> = ({ value, onChange, usesAOL, error, required = false }) => {
  const { t } = useTranslation()
  const [response] = useQuery<GetCountriesQuery, GetCountriesQueryVariables>({
    query: QUERY_COUNTRIES,
  })

  const selected = value

  useEffect(() => {
    if (value !== selected) {
      const newValue = usesAOL ? selected : null

      const ev = { target: { value: newValue } }
      onChange(ev as SelectChangeEvent<SelectValue>)
    }
  }, [onChange, value, selected, usesAOL])

  return (
    <FormControl variant="filled">
      <InputLabel error={error} required={required}>
        {t('country')}
      </InputLabel>

      <Select
        disabled={response.fetching}
        error={error}
        value={selected}
        onChange={onChange}
        data-testid="course-aol-country-select"
        id="course-aol-country"
      >
        {response.data?.countries.length &&
          response.data.countries.map(country => (
            <MenuItem
              key={country.name}
              value={country.name}
              data-testid={`course-aol-country-option-${country}`}
            >
              {t(`aol.countries.${country.name}`)}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}
