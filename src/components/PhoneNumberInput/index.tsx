import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { MuiTelInput } from 'mui-tel-input'
import React from 'react'

export type PhoneNumberInputProps = {
  value: string
  onChange: (value: string) => void
} & BaseTextFieldProps

const PhoneNumberInput: React.FC<
  React.PropsWithChildren<PhoneNumberInputProps>
> = ({ value, onChange, ...props }) => {
  return (
    <MuiTelInput
      onlyCountries={['AU', 'GB']}
      defaultCountry={'GB'}
      forceCallingCode
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

export default PhoneNumberInput
