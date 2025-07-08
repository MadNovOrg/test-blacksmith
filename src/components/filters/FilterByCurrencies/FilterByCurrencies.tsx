import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { useAuth } from '@app/context/auth'
import { Currency } from '@app/generated/graphql'

const ANZ_CURRENCIES = [Currency.Aud, Currency.Nzd]

type Props = {
  onChange: (input: { currencies: Currency[] }) => void
}

export const FilterByCurrencies: React.FC<React.PropsWithChildren<Props>> = ({
  onChange,
}) => {
  const { acl } = useAuth()

  const { t } = useTranslation()

  const possibleCurrencies = useMemo(
    () =>
      Object.values(Currency).filter(
        currency => acl.isUK() || ANZ_CURRENCIES.includes(currency),
      ),
    [acl],
  )

  const [options, setOptions] = useState<FilterOption[]>(() =>
    possibleCurrencies.map(currency => ({
      id: currency,
      title: t(`filters.${currency}`),
      selected: false,
    })),
  )

  const localOnChange = useCallback(
    (opts: FilterOption[]) => {
      setOptions(opts)
      onChange({
        currencies: opts.flatMap(o => (o.selected ? o.id : [])) as Currency[],
      })
    },
    [onChange],
  )

  return (
    <FilterAccordion
      options={options}
      title={t('filters.currency')}
      onChange={localOnChange}
      data-testid="currency-filter"
    />
  )
}
