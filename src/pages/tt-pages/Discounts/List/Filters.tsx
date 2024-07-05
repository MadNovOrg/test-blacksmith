import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterByDates } from '@app/components/filters/FilterByDates'
import { FilterByPromoCodeStatus } from '@app/components/filters/FilterByPromoCodeStatus'
import { FilterByPromoCodeType } from '@app/components/filters/FilterByPromoCodeType'
import { FilterSearch } from '@app/components/FilterSearch'

type Props = { onChange: (next: Record<string, unknown>) => void }

export const Filters: React.FC<React.PropsWithChildren<Props>> = ({
  onChange,
}) => {
  const { t } = useTranslation()

  const [search, setSearch] = useState('')

  const onSearchChange = useCallback(
    (term: string) => {
      setSearch(term)
      onChange({ code: term })
    },
    [onChange],
  )

  const onDatesChange = useCallback(
    (from?: Date, to?: Date) => onChange({ from, to }),
    [onChange],
  )

  const onTypeChange = useCallback(
    (selected: string[]) => onChange({ type: selected }),
    [onChange],
  )

  const onStatusChange = useCallback(
    (selected: string[]) => onChange({ status: selected }),
    [onChange],
  )

  return (
    <>
      <FilterSearch value={search} onChange={onSearchChange} />
      <FilterByPromoCodeType onChange={onTypeChange} />
      <FilterByDates onChange={onDatesChange} title={t('filters.date-range')} />
      <FilterByPromoCodeStatus onChange={onStatusChange} />
    </>
  )
}
