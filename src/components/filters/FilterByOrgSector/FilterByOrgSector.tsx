import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  isUKRegion?: boolean
  onChange: (selected: string[]) => void
}

export const FilterByOrgSector: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()
  const isUKRegion = acl.isUK()

  const sectors = isUKRegion
    ? ['edu', 'hsc_adult', 'hsc_child']
    : ['anz_edu', 'anz_ss', 'anz_health']

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
    [onChange],
  )

  return (
    <FilterAccordion
      options={options}
      title={t('common.sector')}
      onChange={_onChange}
      data-testid="FilterByOrgSector"
    />
  )
}
