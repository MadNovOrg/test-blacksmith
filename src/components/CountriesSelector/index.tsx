import { Autocomplete, Box, TextField } from '@mui/material'
import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { SyntheticEvent } from 'react'
import ReactCountryFlag from 'react-country-flag'

import useWorldCountries, {
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'

export type CountriesSelectorProps = {
  onChange: (event: SyntheticEvent, selected: string | null) => void
  value: string
} & BaseTextFieldProps

const CountriesSelector = ({ onChange, value }: CountriesSelectorProps) => {
  const { countriesCodesWithUKs: countries, getLabel } = useWorldCountries()

  return (
    <Autocomplete
      value={!value ? undefined : value}
      id="country-select-demo"
      options={countries}
      autoHighlight
      getOptionLabel={code => getLabel(code as WorldCountriesCodes) ?? ''}
      renderOption={(props, code) => (
        <Box
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
          label="Country"
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
