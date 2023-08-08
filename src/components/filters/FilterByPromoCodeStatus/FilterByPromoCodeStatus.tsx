import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { PromoCodeStatus } from '@app/types'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  onChange: (selected: string[]) => void
}

const statuses = Object.values(PromoCodeStatus)

export const FilterByPromoCodeStatus: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() => {
    return statuses.map(status => ({
      id: status,
      title: t(`pages.promoCodes.status-${status}`),
      selected: false,
    }))
  })

  const _onChange = useCallback(
    (opts: FilterOption[]) => {
      setOptions(opts)
      onChange(opts.flatMap(o => (o.selected ? o.id : [])))
    },
    [onChange]
  )

  return (
    <FilterAccordion
      options={options}
      title={t('status')}
      onChange={_onChange}
      data-testid="FilterByPromoCodeStatus"
    />
  )
}
