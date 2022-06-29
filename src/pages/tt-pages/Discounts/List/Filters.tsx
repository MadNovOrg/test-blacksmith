import React, { useCallback, useState } from 'react'

import { FilterDates } from '@app/components/FilterDates'
import { FilterPromoCodeType } from '@app/components/FilterPromoCodeType'
import { FilterSearch } from '@app/components/FilterSearch'

type Props = { onChange: (next: Record<string, unknown>) => void }

export const Filters: React.FC<Props> = ({ onChange }) => {
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

  return (
    <>
      <FilterSearch value={search} onChange={onSearchChange} />
      <FilterPromoCodeType onChange={onTypeChange} />
      <FilterDates onChange={onDatesChange} />
    </>
  )
}
