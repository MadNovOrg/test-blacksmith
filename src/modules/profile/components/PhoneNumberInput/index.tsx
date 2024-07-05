import { BaseTextFieldProps } from '@mui/material/TextField/TextField'
import parsePhoneNumberFromString, {
  CountryCode,
  PhoneNumber,
} from 'libphonenumber-js'
import { MuiTelInput, MuiTelInputInfo } from 'mui-tel-input'
import { FC, PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  handleManualError?: (isError: boolean) => void
  defaultCountry?: string
} & BaseTextFieldProps

const PhoneNumberInput: FC<PropsWithChildren<PhoneNumberInputProps>> = ({
  value,
  onChange,
  handleManualError,
  defaultCountry,
  ...props
}) => {
  const [textError, setTextError] = useState('')

  const { countriesISOCodes: onlyCountries } = useWorldCountries()
  const { t } = useTranslation()

  const _props = {
    ...props,
    error: props.error || Boolean(textError),
    helperText: props.helperText || textError,
  }

  // when user manually change the flag & prefix, for countries with same country code
  // like +44 for UK, Isle of Man etc, we run this check to see if the number is still valid
  // Even if they have same prefix +44, the rest of the number is unique for each of them
  // example: +44-1481 (Guernsey), +44-1624 (Isle of Man), +44-1534 (Jersey)
  const checkError = (
    changeInfo: MuiTelInputInfo,
    parsedPhone?: PhoneNumber
  ) => {
    if (
      changeInfo.countryCode &&
      changeInfo.countryCode !== parsedPhone?.country
    ) {
      setTextError(t('validation-errors.invalid-phone'))
      handleManualError?.(true)
    } else {
      setTextError('')
      handleManualError?.(false)
    }
  }

  return (
    <MuiTelInput
      onlyCountries={onlyCountries}
      defaultCountry={defaultCountry ?? DEFAULT_PHONE_COUNTRY}
      value={value.phoneNumber}
      onChange={(phoneNumber, changeInfo) => {
        const parsedPhone = parsePhoneNumberFromString(
          phoneNumber,
          changeInfo.countryCode ?? (DEFAULT_PHONE_COUNTRY as CountryCode)
        )

        checkError(changeInfo, parsedPhone)

        const newPhoneInfo: PhoneNumberSelection = {
          phoneNumber: phoneNumber,
          countryCode: changeInfo?.countryCode ?? '',
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
      {...(_props as any)}
    />
  )
}

export default PhoneNumberInput
