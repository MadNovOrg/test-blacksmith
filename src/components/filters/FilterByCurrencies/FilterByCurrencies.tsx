import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { Currency } from '@app/generated/graphql'

type Props = {
  onChange: (input: { currencies: Currency[] }) => void
}

const possibleCurrencies = Object.values(Currency)

export const FilterByCurrencies: React.FC<React.PropsWithChildren<Props>> = ({
  onChange,
}) => {
  const { t } = useTranslation()

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
