import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseStatus } from '@app/types'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: string[]) => void
}

const statuses = Object.values(CourseStatus)

export const FilterCourseStatus: React.FC<Props> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption[]>(() => {
    return statuses.map(status => ({
      id: status,
      title: t(`course-statuses.${status}`),
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
      title={t('course-status')}
      onChange={_onChange}
      data-testid="FilterCourseStatus"
    />
  )
}
