import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseLevel } from '@app/types'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: string[]) => void
}

const levels = Object.values(CourseLevel)

export const FilterCourseLevel: React.FC<Props> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() => {
    return levels.map(level => ({
      id: level,
      title: t(`course-levels.${level}`),
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
      title={t('level')}
      onChange={_onChange}
      data-testid="FilterCourseLevel"
    />
  )
}
