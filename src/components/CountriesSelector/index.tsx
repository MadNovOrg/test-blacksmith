// TODO: @ion to unit test this functionality
import { Autocomplete, Box, TextField } from '@mui/material'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { SyntheticEvent } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { AustraliaCountryCode, NewZealandCountryCode } from '@app/util'

export type CountriesSelectorProps = {
  courseResidingCountry?: string
  courseType?: Course_Type_Enum
  disableClearable?: boolean
  index?: number
  isBILDcourse?: boolean
  onBlur?: () => void
  onChange: (event: SyntheticEvent, selected: string | null) => void
  onlyAUandNZ?: boolean
  onlyUKCountries?: boolean
  showAllCountries?: boolean
  value: string | undefined | null
} & BaseTextFieldProps

const CountriesSelector = ({
  courseResidingCountry,
  courseType,
  disableClearable,
  disabled,
  error,
  helperText,
  index,
  isBILDcourse,
  label,
  onBlur,
  onChange,
  onlyAUandNZ,
  onlyUKCountries = false,
  required,
  showAllCountries,
  value,
}: CountriesSelectorProps) => {
  const {
    countriesCodesWithUKs: countries,
    ANZCountriesCodes: australiaCountries,
    getLabel,
    isUKCountry,
  } = useWorldCountries()
  const { t } = useTranslation()
  const { acl } = useAuth()
  const isINDIRECTcourse = courseType === Course_Type_Enum.Indirect

  let countriesList = acl.isAustralia() ? australiaCountries : countries

  // In regards to the user's profile,
  // We set the australia countries for australia env to be the default, and have the entire list of countries where needed
  if (showAllCountries) {
    countriesList = countries
  }

  if (
    (isUKCountry(courseResidingCountry) &&
      (isBILDcourse || isINDIRECTcourse)) ||
    onlyUKCountries
  ) {
    countriesList = countries.filter(country => country.includes('GB'))
  }
  if (onlyAUandNZ) {
    countriesList = [AustraliaCountryCode, NewZealandCountryCode]
  }

  return (
    <Autocomplete
      disabled={disabled}
      value={!value ? null : value}
      id="country-select-demo"
      data-testid={`countries-selector-autocomplete${
        index !== undefined ? `-${index}` : ''
      }`}
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
