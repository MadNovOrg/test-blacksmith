import { Autocomplete, Box, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import useCountryRegions from '@app/components/RegionDropdown/hooks/useCountryRegions'

interface Props {
  value: string | null
  onChange: (value: string | null) => void
  usesAOL?: boolean
  country: string | null
  disabled?: boolean
  error?: boolean
  required?: boolean
  label?: string
}

export const RegionDropdown: React.FC<React.PropsWithChildren<Props>> = ({
  value,
  onChange,
  usesAOL,
  country,
  disabled,
  error,
  required = false,
  label,
}) => {
  const { t } = useTranslation()
  const regions = useCountryRegions(country)
  const selected = value

  useEffect(() => {
    if (value !== selected) {
      const newValue = usesAOL ? selected : null

      const ev = { target: { value: newValue } }
      onChange(ev.target.value)
    }
  }, [regions, onChange, value, selected, usesAOL])

  return (
    <Autocomplete
      disabled={disabled || !regions.length}
      multiple={false}
      value={selected || ''}
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
      onChange={(_, value) => onChange(value)}
      disableClearable={true}
      renderInput={params => (
        <TextField
          {...params}
          label={!label ? t('licenced-area') : label}
          data-testid={`course-aol-region-select-${country}`}
          fullWidth
          sx={{ bgcolor: 'grey.100' }}
          variant="filled"
          disabled={disabled}
          error={error}
          required={required}
        />
      )}
    />
  )
}
