import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { MuiTelInput } from 'mui-tel-input'
import { FC, PropsWithChildren } from 'react'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'

export type PhoneNumberInputProps = {
  value: string
  onChange: (value: string) => void
} & BaseTextFieldProps

const PhoneNumberInput: FC<PropsWithChildren<PhoneNumberInputProps>> = ({
  value,
  onChange,
  ...props
}) => {
  const { countriesISOCodes: onlyCountries } = useWorldCountries()

  return (
    <MuiTelInput
      onlyCountries={onlyCountries}
      defaultCountry={'GB'}
      forceCallingCode
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

export default PhoneNumberInput
