import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Status_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: Course_Status_Enum[]) => void
  excludedStatuses?: Set<Course_Status_Enum>
}

const statuses = Object.values(Course_Status_Enum)

export const FilterCourseStatus: React.FC<Props> = ({
  onChange = noop,
  excludedStatuses = new Set(),
}) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption<Course_Status_Enum>[]>(
    () => {
      return statuses
        .map(status =>
          excludedStatuses.has(status)
            ? null
            : {
                id: status,
                title: t(`course-statuses.${status}`),
                selected: false,
              }
        )
        .filter(Boolean)
    }
  )

  const _onChange = useCallback(
    (opts: FilterOption<Course_Status_Enum>[]) => {
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
