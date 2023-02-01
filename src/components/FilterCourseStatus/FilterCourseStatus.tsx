import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { Course_Status_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: Course_Status_Enum[]) => void
  excludedStatuses?: Set<Course_Status_Enum>
}

const statuses = Object.values(Course_Status_Enum)

const CourseStatusParam = withDefault(
  createEnumArrayParam<Course_Status_Enum>(statuses),
  [] as Course_Status_Enum[]
)

export const FilterCourseStatus: React.FC<Props> = ({
  onChange = noop,
  excludedStatuses = new Set(),
}) => {
  const { t } = useTranslation()

  const statusOptions = useMemo(() => {
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
  }, [t, excludedStatuses])

  const [selected, setSelected] = useQueryParam('status', CourseStatusParam)

  const options = useMemo(() => {
    return statusOptions.map(o => ({
      ...o,
      selected: selected.includes(o.id),
    }))
  }, [selected, statusOptions])

  const _onChange = useCallback(
    (opts: FilterOption<Course_Status_Enum>[]) => {
      const sel = opts.flatMap(o => (o.selected ? o.id : []))
      setSelected(sel)
      onChange(sel)
    },
    [onChange, setSelected]
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
