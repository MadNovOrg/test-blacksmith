import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterAccordion, FilterOption } from '@app/components/FilterAccordion'
import { Payment_Methods_Enum } from '@app/generated/graphql'

type Props = {
  onChange: (input: { paymentMethods: Payment_Methods_Enum[] }) => void
}

const possiblePaymentMethods = Object.values(Payment_Methods_Enum)

export const FilterPaymentMethods: React.FC<React.PropsWithChildren<Props>> = ({
  onChange,
}) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() =>
    possiblePaymentMethods.map(pm => ({
      id: pm,
      title: t(`filters.${pm}`),
      selected: false,
    }))
  )

  const localOnChange = useCallback(
    (opts: FilterOption[]) => {
      setOptions(opts)
      onChange({
        paymentMethods: opts.flatMap(o =>
          o.selected ? o.id : []
        ) as Payment_Methods_Enum[],
      })
    },
    [onChange]
  )

  return (
    <FilterAccordion
      options={options}
      title={t('filters.payment-method')}
      onChange={localOnChange}
    />
  )
}
