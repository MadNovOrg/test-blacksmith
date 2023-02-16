import { Autocomplete, Box, TextField } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getAOLRegions } from '../../helpers'

interface Props {
  value: string | null
  onChange: (value: string | null) => void
  usesAOL: boolean
  aolCountry: string | null
  disabled?: boolean
}

export const CourseAOLRegionDropdown: React.FC<
  React.PropsWithChildren<Props>
> = ({ value, onChange, usesAOL, aolCountry, disabled }) => {
  const { t } = useTranslation()

  const regions = useMemo(
    () => ['Region', ...getAOLRegions(aolCountry)],
    [aolCountry]
  )
  const selected = value || regions[0]

  useEffect(() => {
    if (value !== selected) {
      const newValue = usesAOL ? selected : null

      const ev = { target: { value: newValue } }
      onChange(ev.target.value)
    }
  }, [regions, onChange, value, selected, usesAOL])

  return (
    <Autocomplete
      multiple={false}
      value={selected}
      options={regions}
      isOptionEqualToValue={(r, v) => r === v}
      getOptionLabel={region => region}
      renderOption={(props, region) => {
        return (
          <Box
            {...props}
            component="li"
            key={region}
            data-testid={`course-aol-region-option-${region}`}
          >
            {t(`aol.regions.${region}`)}
          </Box>
        )
      }}
      onChange={(event, value) => onChange(value)}
      disableClearable={true}
      renderInput={params => (
        <TextField
          {...params}
          data-testid={`course-aol-region-select-${aolCountry}`}
          fullWidth
          sx={{ bgcolor: 'grey.100' }}
          variant="filled"
          disabled={disabled}
        />
      )}
    />
  )
}
