// TODO: @ion to unit test this functionality
import { CountryCode as CountryISOCode } from 'libphonenumber-js'
import { useCallback, useMemo } from 'react'
import countryList from 'react-select-country-list'

export enum UKsCodes {
  GB_ENG = 'GB-ENG',
  GB_NIR = 'GB-NIR',
  GB_SCT = 'GB-SCT',
  GB_WLS = 'GB-WLS',
}

export const UKsCountriesCodes = {
  'GB-ENG': 'England',
  'GB-NIR': 'Northern Ireland',
  'GB-SCT': 'Scotland',
  'GB-WLS': 'Wales',
} as const

export const ExceptionsCountriesCodes = {
  XK: 'Kosovo',
} as const

export type UKsCountriesCode = keyof typeof UKsCountriesCodes
export type ExceptionsCountriesCode = keyof typeof ExceptionsCountriesCodes

export type WorldCountriesCodes = CountryISOCode | UKsCountriesCode

export enum ForeignScript {
  ARABIC = 'Arabic',
  ARMENIAN = 'Armenian',
  CHINESE = 'Chinese',
  GEORGIAN = 'Georgian',
  HEBREW = 'Hebrew',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  LAO = 'Lao',
  MYANMAR = 'Myanmar',
  THAI = 'Thai',
}

export const ForeignScriptRegex = {
  [ForeignScript.ARABIC]:
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  [ForeignScript.ARMENIAN]: /[\u0530-\u058F\uFB13-\uFB17]/,
  [ForeignScript.CHINESE]: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
  [ForeignScript.GEORGIAN]: /[\u10A0-\u10FF]/,
  [ForeignScript.HEBREW]: /[\u0590-\u05FF]/,
  [ForeignScript.JAPANESE]:
    /[\u3040-\u30FF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF]/,
  [ForeignScript.KOREAN]: /[\uAC00-\uD7AF\uD7B0-\uD7FF]/,
  [ForeignScript.LAO]: /[\u0E80-\u0EFF]/,
  [ForeignScript.MYANMAR]: /[\u1000-\u109F\uAA60-\uAA7F]/,
  [ForeignScript.THAI]: /[\u0E00-\u0E7F]/,
}

export const ForeignScriptFontPaths = {
  [ForeignScript.ARABIC]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHF3lhQ5l3sQWIHPqzCflmyvu3CBFQLaig.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHF3lhQ5l3sQWIHPqzCf-myvu3CBFQLaig.ttf',
    },
  ],
  [ForeignScript.ARMENIAN]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosansarmenian/v43/ZgN0jOZKPa7CHqq0h37c7ReDUubm2SEdFXp7ig73qtTY5kBb74R9UdM3y2nZLoqvb60iYy6zF3Eg.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosansarmenian/v43/ZgN0jOZKPa7CHqq0h37c7ReDUubm2SEdFXp7ig73qtTY5kBb74R9UdM3y2nZLorDb60iYy6zF3Eg.ttf',
    },
  ],
  [ForeignScript.CHINESE]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG4HFnYxNbPzS5HE.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosanssc/v36/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG-3FnYxNbPzS5HE.ttf',
    },
  ],
  [ForeignScript.GEORGIAN]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosansgeorgian/v44/PlIaFke5O6RzLfvNNVSitxkr76PRHBC4Ytyq-Gof7PUs4UnzWn-8YDB09HFNdpu5zFj-f5WK0OQV.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosansgeorgian/v44/PlIaFke5O6RzLfvNNVSitxkr76PRHBC4Ytyq-Gof7PUs4UnzWn-8YDB09HFNdpvVzFj-f5WK0OQV.ttf',
    },
  ],
  [ForeignScript.HEBREW]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosanshebrew/v45/or3HQ7v33eiDljA1IufXTtVf7V6RvEEdhQlk0LlGxCz9eNKYZC0sqk3xXGiXKYqtoiJltutR2g.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosanshebrew/v45/or3HQ7v33eiDljA1IufXTtVf7V6RvEEdhQlk0LlGxCz9eNKYZC0sqk3xXGiXRYqtoiJltutR2g.ttf',
    },
  ],
  [ForeignScript.JAPANESE]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFE8j75vY0rw-oME.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFCMj75vY0rw-oME.ttf',
    },
  ],
  [ForeignScript.KOREAN]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzrQyeLTq8H4hfeE.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzztgyeLTq8H4hfeE.ttf',
    },
  ],
  [ForeignScript.LAO]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosanslao/v30/bx6lNx2Ol_ixgdYWLm9BwxM3NW6BOkuf763Clj6QCiQ_J1Djx9pidOt4L8bdf5MK3riB2w.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosanslao/v30/bx6lNx2Ol_ixgdYWLm9BwxM3NW6BOkuf763Clj6QCiQ_J1Djx9pidOt4Q8bdf5MK3riB2w.ttf',
    },
  ],
  [ForeignScript.MYANMAR]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosansmyanmar/v20/AlZv_y1ZtY3ymOryg38hOCSdOnFq0HFa9MEwiEwLxR-r.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosansmyanmar/v20/AlZv_y1ZtY3ymOryg38hOCSdOnFq0HEC9cEwiEwLxR-r.ttf',
    },
  ],
  [ForeignScript.THAI]: [
    {
      fontWeight: 300,
      src: 'https://fonts.gstatic.com/s/notosansthai/v25/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNPsd1MKVQt_So_9CdU8ptpzF-QRvzzXg.ttf',
    },
    {
      fontWeight: 500,
      src: 'https://fonts.gstatic.com/s/notosansthai/v25/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNPsd1MKVQt_So_9CdU6ZtpzF-QRvzzXg.ttf',
    },
  ],
}

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
      'GG',
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
      'IM',
      'JM',
      'JE',
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

  const getUKCountryCodeByCountryName = useCallback((countryName: string) => {
    const found = Object.entries(UKsCountriesCodes).find(
      ([_, value]) => value === countryName
    )

    return found ? found[0] : undefined
  }, [])

  return {
    checkUKsCountryName,
    countries,
    countriesCodesWithUKs,
    countriesISOCodes,
    getLabel,
    getUKCountryCodeByCountryName,
    isUKCountry,
  }
}

export const getForeignScript = (text: string): ForeignScript | null => {
  const result = Object.keys(ForeignScriptRegex).find(script =>
    ForeignScriptRegex[script as ForeignScript].test(text)
  )

  if (!result) return null

  return result as ForeignScript
}
