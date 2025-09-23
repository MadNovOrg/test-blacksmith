import { MenuItem } from '@mui/material'
import TextField, {
  StandardTextFieldProps,
} from '@mui/material/TextField/TextField'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useCurrencies } from '@app/hooks/useCurrencies/useCurrencies'

const CurrencySelector = ({
  error,
  helperText,
  ...props
}: StandardTextFieldProps) => {
  const { activeCurrencies, currencyBySymbol } = useCurrencies()

  const currencies = useMemo(
    () => Object.values(activeCurrencies),
    [activeCurrencies],
  )
  const { t } = useTranslation()

  return (
    <TextField
      {...props}
      error={error}
      helperText={helperText}
      id="filled-select-currency-native"
      data-testid="currency-selector"
      select
      label={t('currency-word')}
      variant="filled"
    >
      {currencies.map(option => (
        <MenuItem key={option} value={currencyBySymbol[option]}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default CurrencySelector
