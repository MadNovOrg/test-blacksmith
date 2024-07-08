// TODO: @ion to unit test this functionality
import { Autocomplete, Box, TextField } from '@mui/material'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { SyntheticEvent } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { Course_Type_Enum } from '@app/generated/graphql'

export type CountriesSelectorProps = {
  onChange: (event: SyntheticEvent, selected: string | null) => void
  value: string | undefined | null
  courseResidingCountry?: string
  courseType?: Course_Type_Enum
  disableClearable?: boolean
  isBILDcourse?: boolean
  onBlur?: () => void
  onlyUKCountries?: boolean
} & BaseTextFieldProps

const CountriesSelector = ({
  courseResidingCountry,
  courseType,
  disableClearable,
  disabled,
  error,
  helperText,
  isBILDcourse,
  label,
  onBlur,
  onChange,
  onlyUKCountries = false,
  required,
  value,
}: CountriesSelectorProps) => {
  const {
    countriesCodesWithUKs: countries,
    getLabel,
    isUKCountry,
  } = useWorldCountries()
  const { t } = useTranslation()
  const isINDIRECTcourse = courseType === Course_Type_Enum.Indirect

  let countriesList = countries

  if (
    (isUKCountry(courseResidingCountry) &&
      (isBILDcourse || isINDIRECTcourse)) ||
    onlyUKCountries
  ) {
    countriesList = countries.filter(country => country.includes('GB'))
  }

  return (
    <Autocomplete
      disabled={disabled}
      value={!value ? undefined : value}
      id="country-select-demo"
      data-testid="countries-selector-autocomplete"
      options={countriesList}
      autoHighlight
      getOptionLabel={code => getLabel(code as WorldCountriesCodes) ?? ''}
      disableClearable={disableClearable}
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
          onBlur={onBlur}
          disabled={disabled}
          data-testid={`countries-selector-input`}
          error={error}
          helperText={helperText}
          label={label ?? t('residing-country')}
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
