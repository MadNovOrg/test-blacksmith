// TODO: @ion to unit test this functionality
import { Autocomplete, Box, TextField } from '@mui/material'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { SyntheticEvent } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'

export type CountriesSelectorProps = {
  onChange: (event: SyntheticEvent, selected: string | null) => void
  value: string | undefined | null
} & BaseTextFieldProps

const CountriesSelector = ({
  onChange,
  value,
  label,
  error,
  required,
  helperText,
  disabled,
}: CountriesSelectorProps) => {
  const { countriesCodesWithUKs: countries, getLabel } = useWorldCountries()
  const { t } = useTranslation()

  return (
    <Autocomplete
      disabled={disabled}
      value={!value ? undefined : value}
      id="country-select-demo"
      data-testid="countries-selector-autocomplete"
      options={countries}
      autoHighlight
      getOptionLabel={code => getLabel(code as WorldCountriesCodes) ?? ''}
      renderOption={(props, code) => (
        <Box
          data-testid={`country-${code}`}
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <ReactCountryFlag countryCode={code} svg />
          {getLabel(code as WorldCountriesCodes)}
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          disabled={disabled}
          data-testid={`countries-selector-input`}
          error={error}
          helperText={helperText}
          label={label ?? t('country')}
          required={required}
          inputProps={{
            ...params.inputProps,
          }}
          variant="filled"
        />
      )}
      onChange={onChange}
    />
  )
}

export default CountriesSelector
