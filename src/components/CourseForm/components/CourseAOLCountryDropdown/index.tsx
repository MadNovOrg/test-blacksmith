import { Select, SelectChangeEvent, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { getAOLCountries } from '../../helpers'

type SelectValue = string | null

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  usesAOL: boolean
}

const countries = ['placeholder', ...getAOLCountries()]

export const CourseAOLCountryDropdown: React.FC<
  React.PropsWithChildren<Props>
> = ({ value, onChange, usesAOL }) => {
  const { t } = useTranslation()

  const selected = value || countries[0]

  useEffect(() => {
    if (value !== selected) {
      const newValue = usesAOL ? selected : null

      const ev = { target: { value: newValue } }
      onChange(ev as SelectChangeEvent<SelectValue>)
    }
  }, [onChange, value, selected, usesAOL])

  return (
    <Select
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
  )
}
