import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterDates } from '@app/components/FilterDates'
import { FilterPromoCodeStatus } from '@app/components/FilterPromoCodeStatus'
import { FilterPromoCodeType } from '@app/components/FilterPromoCodeType'
import { FilterSearch } from '@app/components/FilterSearch'

type Props = { onChange: (next: Record<string, unknown>) => void }

export const Filters: React.FC<Props> = ({ onChange }) => {
  const { t } = useTranslation()

  const [search, setSearch] = useState('')

  const onSearchChange = useCallback(
    (term: string) => {
      setSearch(term)
      onChange({ code: term })
    },
    [onChange]
  )

  const onDatesChange = useCallback(
    (from?: Date, to?: Date) => onChange({ from, to }),
    [onChange]
  )

  const onTypeChange = useCallback(
    (selected: string[]) => onChange({ type: selected }),
    [onChange]
  )

  const onStatusChange = useCallback(
    (selected: string[]) => onChange({ status: selected }),
    [onChange]
  )

  return (
    <>
      <FilterSearch value={search} onChange={onSearchChange} />
      <FilterPromoCodeType onChange={onTypeChange} />
      <FilterDates onChange={onDatesChange} title={t('filters.date-range')} />
      <FilterPromoCodeStatus onChange={onStatusChange} />
    </>
  )
}
