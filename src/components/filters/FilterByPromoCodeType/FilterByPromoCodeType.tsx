import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Promo_Code_Type_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  onChange: (selected: string[]) => void
}

const types = Object.values(Promo_Code_Type_Enum)

export const FilterByPromoCodeType: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() => {
    return types.map(type => ({
      id: type,
      title: t(`promo-code-types.${type}`),
      selected: false,
    }))
  })

  const _onChange = useCallback(
    (opts: FilterOption[]) => {
      setOptions(opts)
      onChange(opts.flatMap(o => (o.selected ? o.id : [])))
    },
    [onChange],
  )

  return (
    <FilterAccordion
      options={options}
      title={t('type')}
      onChange={_onChange}
      data-testid="FilterByPromoCodeType"
    />
  )
}
