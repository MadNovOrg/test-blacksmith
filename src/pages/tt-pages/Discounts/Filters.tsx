import React, { useCallback } from 'react'

import { FilterDates } from '@app/components/FilterDates'

type Props = { onChange: (next: Record<string, unknown>) => void }

export const Filters: React.FC<Props> = ({ onChange }) => {
  const onDatesChange = useCallback(
    (from?: Date, to?: Date) => onChange({ from, to }),
    [onChange]
  )

  return (
    <>
      <FilterDates onChange={onDatesChange} />
    </>
  )
}
