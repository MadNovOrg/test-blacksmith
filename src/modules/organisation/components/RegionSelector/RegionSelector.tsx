import { TextField, MenuItem } from '@mui/material'
import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { australiaRegions, newZealandRegions } from '../../utils/ANZ'

interface IRegionDropdownProps {
  countryCode: string
  required: boolean
  error: boolean
  errormessage?: string
  value: string | null
  register: UseFormRegisterReturn
  enableOther?: boolean
}
export const RegionSelector = React.forwardRef(function RegionSelector(
  props: IRegionDropdownProps,
) {
  const {
    countryCode,
    required,
    error,
    errormessage,
    enableOther,
    value,
    register,
  } = props

  const { isAustraliaCountry, isNewZealandCountry } = useWorldCountries()
  const { t } = useScopedTranslation('components.organisation-region')
  const isAustralia = isAustraliaCountry(countryCode)
  const isNewZeeland = isNewZealandCountry(countryCode)

  const options = isAustralia ? australiaRegions : newZealandRegions
  if (enableOther && !options.includes('Other')) {
    options.push('Other')
  }
  if (!isAustralia && !isNewZeeland) {
    return null
  }
  const defaultLabel = isAustralia ? 'stateTerritory' : 'region'

  return (
    <TextField
      sx={{ bgcolor: 'grey.100' }}
      select
      fullWidth
      variant="filled"
      required={required}
      error={error}
      helperText={errormessage}
      label={t(enableOther ? 'postal-address-state-territory' : defaultLabel)}
      {...register}
      value={value}
      defaultValue={value}
      data-testid="region-selector"
    >
      {options?.length ? (
        options.map(option => (
          <MenuItem
            key={option}
            value={option}
            data-testid={`region-option-${option}`}
          >
            {option}
          </MenuItem>
        ))
      ) : (
        <MenuItem value="" disabled>
          {t('region')}
        </MenuItem>
      )}
    </TextField>
  )
})
