import React, { useCallback } from 'react'

import { FilterDates } from '@app/components/FilterDates'
import { FilterPromoCodeType } from '@app/components/FilterPromoCodeType'

type Props = { onChange: (next: Record<string, unknown>) => void }

export const Filters: React.FC<Props> = ({ onChange }) => {
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
      <FilterPromoCodeType onChange={onTypeChange} />
      <FilterDates onChange={onDatesChange} />
    </>
  )
}
