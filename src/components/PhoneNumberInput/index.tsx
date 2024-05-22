import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import { MuiTelInput } from 'mui-tel-input'
import { FC, PropsWithChildren } from 'react'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'

import { FlagComponent } from './FlagComponent'

export interface PhoneNumberSelection {
  phoneNumber: string
  countryCode: string
}

export const DEFAULT_PHONE_COUNTRY = 'GB'

export type PhoneNumberInputProps = {
  value: PhoneNumberSelection
  onChange: (value: PhoneNumberSelection) => void
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
      defaultCountry={DEFAULT_PHONE_COUNTRY}
      value={value.phoneNumber}
      onChange={(phoneNumber, changeInfo) => {
        const shouldReplaceCountryCode =
          changeInfo.numberValue?.split(' ').join('').substring(0, 3) !==
          value.phoneNumber.split(' ').join('').substring(0, 3)

        const newCountryCode =
          shouldReplaceCountryCode || changeInfo.reason === 'country'
            ? changeInfo.countryCode
            : value.countryCode

        const newPhoneInfo: PhoneNumberSelection = {
          phoneNumber: phoneNumber,
          countryCode: newCountryCode ?? '',
        }
        onChange(newPhoneInfo)
      }}
      inputProps={{ 'data-testid': 'phone' }}
      getFlagElement={(isoCode, { isSelected, countryName }) => {
        // this component show country flag based on number prefix
        // however, there are some countries with same prefix +44 - UK, Jersey, Isle of Man etc...
        // this logic was created to fix this issue (+phoneCountryCode column in DB)
        const showDefaultFlag = !isSelected || !value.countryCode

        return (
          <FlagComponent
            countryName={countryName}
            isoCode={showDefaultFlag ? isoCode : value.countryCode ?? ''}
          />
        )
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    />
  )
}

export default PhoneNumberInput
