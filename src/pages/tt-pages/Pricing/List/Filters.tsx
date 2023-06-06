import React, { useCallback } from 'react'
import { BooleanParam, useQueryParam, withDefault } from 'use-query-params'

import { FilterByBlendedLearning } from '@app/components/FilterByBlendedLearning'
import { FilterByReaccreditation } from '@app/components/FilterByReaccreditation'
import { FilterCourseLevel } from '@app/components/FilterCourseLevel'
import { FilterCourseType } from '@app/components/FilterCourseType'

type Props = { onChange: (next: Record<string, unknown>) => void }

export const Filters: React.FC<Props> = ({ onChange }) => {
  const [filterBlendedLearning, setFilterBlendedLearning] = useQueryParam(
    'bl',
    withDefault(BooleanParam, false)
  )

  const [filterReaccreditation, setFilterReaccreditation] = useQueryParam(
    'reacc',
    withDefault(BooleanParam, false)
  )

  const onLevelsChange = useCallback(
    (selected: string[]) => onChange({ levels: selected }),
    [onChange]
  )

  const onTypeChange = useCallback(
    (selected: string[]) => onChange({ type: selected }),
    [onChange]
  )

  const onBlendedChange = useCallback(
    (selected: boolean) => {
      onChange({ blended: selected })
      setFilterBlendedLearning(selected)
    },
    [onChange, setFilterBlendedLearning]
  )

  const onReaccreditationChange = useCallback(
    (selected: boolean) => {
      onChange({ reaccreditation: selected })
      setFilterReaccreditation(selected)
    },
    [onChange, setFilterReaccreditation]
  )

  return (
    <>
      <FilterCourseLevel onChange={onLevelsChange} />
      <FilterCourseType onChange={onTypeChange} />
      <FilterByBlendedLearning
        selected={filterBlendedLearning}
        onChange={onBlendedChange}
      />
      <FilterByReaccreditation
        selected={filterReaccreditation}
        onChange={onReaccreditationChange}
      />
    </>
  )
}
