// TODO: @ion to unit test this functionality
import { CountryCode as CountryISOCode } from 'libphonenumber-js'
import { useCallback, useMemo } from 'react'
import countryList from 'react-select-country-list'

export const UKsCountriesCodes = {
  ['GB-ENG']: 'England',
  ['GB-NIR']: 'Northern Ireland',
  ['GB-SCT']: 'Scotland',
  ['GB-WLS']: 'Wales',
} as const

export const ExceptionsCountriesCodes = {
  ['XK']: 'Kosovo',
} as const

export type UKsCountriesCode = keyof typeof UKsCountriesCodes
export type ExceptionsCountriesCode = keyof typeof ExceptionsCountriesCodes

export type WorldCountriesCodes = CountryISOCode | UKsCountriesCode

export default function useWorldCountries() {
  const countries = useMemo(() => {
    return countryList()
  }, [])

  const getLabel = useCallback(
    (code: CountryISOCode | UKsCountriesCode | string | null | undefined) => {
      if (!countries || !code) return undefined

      if (Object.keys(UKsCountriesCodes).includes(code)) {
        return UKsCountriesCodes[code as UKsCountriesCode]
      }

      if (Object.keys(ExceptionsCountriesCodes).includes(code)) {
        return ExceptionsCountriesCodes[code as ExceptionsCountriesCode]
      }

      return countries.getLabel(code)
    },
    [countries]
  )

  const countriesISOCodes: CountryISOCode[] = useMemo(
    () => [
      'AD',
      'AE',
      'AF',
      'AG',
      'AL',
      'AM',
      'AO',
      'AR',
      'AT',
      'AU',
      'AZ',
      'BA',
      'BB',
      'BD',
      'BE',
      'BF',
      'BG',
      'BH',
      'BI',
      'BJ',
      'BN',
      'BO',
      'BR',
      'BS',
      'BT',
      'BW',
      'BY',
      'BZ',
      'CA',
      'CD',
      'CF',
      'CG',
      'CH',
      'CI',
      'CL',
      'CM',
      'CN',
      'CO',
      'CR',
      'CU',
      'CV',
      'CY',
      'CZ',
      'DE',
      'DJ',
      'DK',
      'DM',
      'DO',
      'DZ',
      'EC',
      'EE',
      'EG',
      'EH',
      'ER',
      'ES',
      'ET',
      'FI',
      'FJ',
      'FM',
      'FR',
      'GA',
      'GB',
      'GD',
      'GE',
      'GH',
      'GM',
      'GN',
      'GQ',
      'GR',
      'GT',
      'GW',
      'GY',
      'HN',
      'HR',
      'HT',
      'HU',
      'ID',
      'IE',
      'IL',
      'IN',
      'IQ',
      'IR',
      'IS',
      'IT',
      'JM',
      'JO',
      'JP',
      'KE',
      'KG',
      'KH',
      'KI',
      'KM',
      'KN',
      'KP',
      'KR',
      'KW',
      'KZ',
      'LA',
      'LB',
      'LC',
      'LI',
      'LK',
      'LR',
      'LS',
      'LT',
      'LU',
      'LV',
      'LY',
      'MA',
      'MC',
      'MD',
      'ME',
      'MG',
      'MH',
      'MK',
      'ML',
      'MM',
      'MN',
      'MR',
      'MT',
      'MU',
      'MV',
      'MW',
      'MX',
      'MY',
      'MZ',
      'NA',
      'NE',
      'NG',
      'NI',
      'NL',
      'NO',
      'NP',
      'NR',
      'NZ',
      'OM',
      'PA',
      'PE',
      'PG',
      'PH',
      'PK',
      'PL',
      'PT',
      'PW',
      'PY',
      'QA',
      'RO',
      'RS',
      'RU',
      'RW',
      'SA',
      'SB',
      'SC',
      'SD',
      'SE',
      'SG',
      'SI',
      'SK',
      'SL',
      'SM',
      'SN',
      'SO',
      'SR',
      'SS',
      'ST',
      'SV',
      'SY',
      'SZ',
      'TD',
      'TG',
      'TH',
      'TJ',
      'TL',
      'TM',
      'TN',
      'TO',
      'TR',
      'TT',
      'TV',
      'TW',
      'TZ',
      'UA',
      'UG',
      'US',
      'UY',
      'UZ',
      'VA',
      'VC',
      'VE',
      'VN',
      'VU',
      'XK',
      'YE',
      'ZA',
      'ZM',
      'ZW',
    ],
    []
  )

  const countriesCodesWithUKs: WorldCountriesCodes[] = useMemo(
    () => [
      'GB-ENG',
      'GB-NIR',
      'GB-SCT',
      'GB-WLS',
      ...countriesISOCodes
        .filter(code => code !== 'GB')
        .sort((a, b) => getLabel(a)?.localeCompare(getLabel(b) ?? '') || 0),
    ],
    [countriesISOCodes, getLabel]
  )

  const isUKCountry = useCallback(
    (
      countryCode: CountryISOCode | UKsCountriesCode | string | null | undefined
    ) => {
      if (!countryCode) return false

      return Object.keys(UKsCountriesCodes).includes(countryCode)
    },
    []
  )

  const checkUKsCountryName = useCallback(
    (country: string | null | undefined) => {
      if (!country) return false

      return (Object.values(UKsCountriesCodes) as string[]).includes(country)
    },
    []
  )

  return {
    checkUKsCountryName,
    countries,
    countriesCodesWithUKs,
    countriesISOCodes,
    getLabel,
    isUKCountry,
  }
}
