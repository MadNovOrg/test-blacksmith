import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseType } from '@app/types'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: string[]) => void
}

const types = Object.values(CourseType)

export const FilterCourseType: React.FC<Props> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() => {
    return types.map(type => ({
      id: type,
      title: t(`course-types.${type}`),
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
      title={t('course-type')}
      onChange={_onChange}
      data-testid="FilterCourseType"
    />
  )
}
