import { MenuItem } from '@mui/material'
import TextField, {
  StandardTextFieldProps,
} from '@mui/material/TextField/TextField'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const CurrenciesCodes = {
  ['$']: 'USD',
  ['AUD $']: 'AUD',
  ['NZD $']: 'NZD',
  ['£']: 'GBP',
  ['€']: 'EUR',
} as const

export type CurrenciesLabels = keyof typeof CurrenciesCodes
export type CurrencyCode = (typeof CurrenciesCodes)[CurrenciesLabels]

export const CurrenciesSymbols = Object.fromEntries(
  Object.entries(CurrenciesCodes).map(([label, code]) => [code, label])
) as {
  [key in CurrenciesLabels as (typeof CurrenciesCodes)[key]]: key
}

export const defaultCurrencyCode = CurrenciesCodes['£']

const CurrencySelector = ({
  error,
  helperText,
  ...props
}: StandardTextFieldProps) => {
  const { t } = useTranslation()
  const currencies = useMemo<CurrenciesLabels[]>(
    () => Object.keys(CurrenciesCodes) as CurrenciesLabels[],
    []
  )

  return (
    <TextField
      {...props}
      error={error}
      helperText={helperText}
      id="filled-select-currency-native"
      select
      label={t('currency-word')}
      variant="filled"
    >
      {currencies.map(option => (
        <MenuItem key={option} value={CurrenciesCodes[option]}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default CurrencySelector
