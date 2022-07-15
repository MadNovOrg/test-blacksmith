import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Level_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: Course_Level_Enum[]) => void
}

const levels = Object.values(Course_Level_Enum)

export const FilterCourseLevel: React.FC<Props> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption<Course_Level_Enum>[]>(
    () => {
      return levels.map(level => ({
        id: level,
        title: t(`course-levels.${level}`),
        selected: false,
      }))
    }
  )

  const _onChange = useCallback(
    (opts: FilterOption<Course_Level_Enum>[]) => {
      setOptions(opts)
      onChange(opts.flatMap(o => (o.selected ? o.id : [])))
    },
    [onChange]
  )

  return (
    <FilterAccordion
      options={options}
      title={t('level')}
      onChange={_onChange}
      data-testid="FilterCourseLevel"
    />
  )
}
