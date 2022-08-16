import { Select, SelectChangeEvent, MenuItem } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getAOLRegions } from '../../helpers'

type SelectValue = string | null

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  usesAOL: boolean
  aolCountry: string | null
}

export const CourseAOLRegionDropdown: React.FC<Props> = ({
  value,
  onChange,
  usesAOL,
  aolCountry,
}) => {
  const { t } = useTranslation()

  const regions = useMemo(
    () => ['placeholder', ...getAOLRegions(aolCountry)],
    [aolCountry]
  )
  const selected = value || regions[0]

  useEffect(() => {
    if (value !== selected) {
      const newValue = usesAOL ? selected : null

      const ev = { target: { value: newValue } }
      onChange(ev as SelectChangeEvent<SelectValue>)
    }
  }, [regions, onChange, value, selected, usesAOL])

  return (
    <Select
      value={selected}
      onChange={onChange}
      data-testid="course-aol-region-select"
      id="course-aol-region"
    >
      {regions.map((region: string) => (
        <MenuItem
          key={region}
          value={region}
          data-testid={`course-aol-region-option-${region}`}
        >
          {t(`aol.regions.${region}`)}
        </MenuItem>
      ))}
    </Select>
  )
}
