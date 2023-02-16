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
  onChange: (selected: string[]) => void
  excludedStatuses?: Set<string>
  customStatuses?: Set<string>
}

const statuses = Object.values(Course_Status_Enum) as string[]

export const FilterCourseStatus: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
  excludedStatuses = new Set(),
  customStatuses = new Set(),
}) => {
  const { t } = useTranslation()

  const allStatuses = useMemo(
    () => [...statuses, ...customStatuses],
    [customStatuses]
  )
  const statusOptions = useMemo(() => {
    return allStatuses
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
  }, [allStatuses, excludedStatuses, t])

  const [selected, setSelected] = useQueryParam(
    'status',
    withDefault(createEnumArrayParam<string>(allStatuses), [] as string[])
  )

  const options = useMemo(() => {
    return statusOptions.map(o => ({
      ...o,
      selected: selected.includes(o.id),
    }))
  }, [selected, statusOptions])

  const _onChange = useCallback(
    (opts: FilterOption[]) => {
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
