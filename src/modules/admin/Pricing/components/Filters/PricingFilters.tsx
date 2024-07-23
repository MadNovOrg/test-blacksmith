import React, { useCallback } from 'react'
import { BooleanParam, useQueryParam, withDefault } from 'use-query-params'

import { FilterByBlendedLearning } from '@app/components/filters/FilterByBlendedLearning'
import { FilterByCourseLevel } from '@app/components/filters/FilterByCourseLevel'
import { FilterByCourseType } from '@app/components/filters/FilterByCourseType'
import { FilterByReaccreditation } from '@app/components/filters/FilterByReaccreditation'
import { Course_Type_Enum } from '@app/generated/graphql'

import { BILD_COURSE_LEVELS } from '../../utils'

type Props = { onChange: (next: Record<string, unknown>) => void }

export const PricingFilters: React.FC<Props> = ({ onChange }) => {
  const [filterBlendedLearning, setFilterBlendedLearning] = useQueryParam(
    'bl',
    withDefault(BooleanParam, false),
  )

  const [filterReaccreditation, setFilterReaccreditation] = useQueryParam(
    'reacc',
    withDefault(BooleanParam, false),
  )

  const onLevelsChange = useCallback(
    (selected: string[]) => onChange({ levels: selected }),
    [onChange],
  )

  const onTypeChange = useCallback(
    (selected: string[]) => onChange({ type: selected }),
    [onChange],
  )

  const onBlendedChange = useCallback(
    (selected: boolean) => {
      onChange({ blended: selected })
      setFilterBlendedLearning(selected)
    },
    [onChange, setFilterBlendedLearning],
  )

  const onReaccreditationChange = useCallback(
    (selected: boolean) => {
      onChange({ reaccreditation: selected })
      setFilterReaccreditation(selected)
    },
    [onChange, setFilterReaccreditation],
  )

  return (
    <>
      <FilterByCourseLevel
        onChange={onLevelsChange}
        excludedStatuses={new Set(BILD_COURSE_LEVELS)}
      />
      <FilterByCourseType
        onChange={onTypeChange}
        courseTypeBlacklist={Course_Type_Enum.Indirect}
      />
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
