import { useMemo } from 'react'

import { useAuth } from '@app/context/auth'

export const ukAvailableCurrencies = {
  USD: '$',
  AUD: 'AUD $',
  NZD: 'NZD $',
  GBP: '£',
  EUR: '€',
} as const

export const anzAvailableCurrencies = {
  AUD: 'AUD $',
  NZD: 'NZD $',
} as const

const currencyAbbreviations = {
  AUD: 'A$',
  NZD: 'NZ$',
  GBP: '£',
  EUR: '€',
  USD: '$',
}

export type CurrencyKey =
  | keyof typeof ukAvailableCurrencies
  | keyof typeof anzAvailableCurrencies

type UKCurrencyValue = (typeof ukAvailableCurrencies)[CurrencyKey &
  keyof typeof ukAvailableCurrencies]
type ANZCurrencyValue = (typeof anzAvailableCurrencies)[CurrencyKey &
  keyof typeof anzAvailableCurrencies]

export type CurrencySymbol = UKCurrencyValue | ANZCurrencyValue

export const useCurrencies = (residingCountry?: string) => {
  const {
    acl: { isAustralia },
  } = useAuth()

  const activeCurrencies = useMemo<
    typeof isAustralia extends true
      ? typeof anzAvailableCurrencies
      : typeof ukAvailableCurrencies
    // @ts-expect-error // This is a hack to get the correct type
  >(() => {
    if (isAustralia()) return anzAvailableCurrencies
    return ukAvailableCurrencies
  }, [isAustralia])

  const currencyCodes = useMemo(() => {
    return Object.fromEntries(
      Object.keys(activeCurrencies).map(currency => [currency, currency]),
    ) as Record<CurrencyKey, CurrencyKey>
  }, [activeCurrencies])

  const defaultCurrency = useMemo<CurrencyKey>(() => {
    if (isAustralia() && ['NZ'].includes(residingCountry ?? ''))
      return currencyCodes.NZD
    if (isAustralia()) return currencyCodes.AUD
    return currencyCodes.GBP
  }, [currencyCodes, isAustralia, residingCountry])

  const currencyBySymbol = useMemo(() => {
    return Object.fromEntries(
      Object.entries(activeCurrencies).map(([currency, symbol]) => [
        symbol,
        currency,
      ]),
    )
  }, [activeCurrencies])

  return {
    activeCurrencies,
    defaultCurrency,
    currencyBySymbol,
    currencyAbbreviations,
  }
}
