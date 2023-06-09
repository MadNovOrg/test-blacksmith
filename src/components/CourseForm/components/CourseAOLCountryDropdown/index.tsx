import {
  Select,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { getAOLCountries } from '../../helpers'

type SelectValue = string | null

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  usesAOL: boolean
  error?: boolean
  required?: boolean
}

const countries = [...getAOLCountries()]

export const CourseAOLCountryDropdown: React.FC<
  React.PropsWithChildren<Props>
> = ({ value, onChange, usesAOL, error, required = false }) => {
  const { t } = useTranslation()

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
        error={error}
        value={selected}
        onChange={onChange}
        data-testid="course-aol-country-select"
        id="course-aol-country"
      >
        {countries.map(country => (
          <MenuItem
            key={country}
            value={country}
            data-testid={`course-aol-country-option-${country}`}
          >
            {t(`aol.countries.${country}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
