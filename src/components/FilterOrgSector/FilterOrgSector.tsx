import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: string[]) => void
}

const sectors = [
  'education',
  'adults-health-and-social-care',
  'childrens-health-and-social-care',
]

export const FilterOrgSector: React.FC<Props> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() => {
    return sectors.map(sector => ({
      id: sector,
      title: t(`common.org-sectors.${sector}`),
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
      title={t('common.sector')}
      onChange={_onChange}
      data-testid="FilterOrgSector"
    />
  )
}
