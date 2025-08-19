import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { Course_Level_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  title?: string
  onChange: (selected: Course_Level_Enum[]) => void
  excludedStatuses?: Set<Course_Level_Enum>
  customStatuses?: Set<Course_Level_Enum>
}

const levels = Object.values(Course_Level_Enum)

const CourseLevelParam = withDefault(
  createEnumArrayParam<Course_Level_Enum>(levels),
  [] as Course_Level_Enum[],
)

export const FilterByCourseLevel: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  onChange = noop,
  excludedStatuses = new Set(),
  customStatuses = new Set(),
}) => {
  const { t } = useTranslation()

  const allStatuses = useMemo(
    () => [...levels, ...customStatuses],
    [customStatuses],
  )

  const levelOptions = useMemo(() => {
    return allStatuses
      .map(level =>
        excludedStatuses.has(level)
          ? null
          : {
              id: level,
              title: t(`course-levels.${level}`),
            },
      )
      .filter(Boolean)
  }, [allStatuses, excludedStatuses, t])

  const [selected, setSelected] = useQueryParam('level', CourseLevelParam)

  const options = useMemo(() => {
    return levelOptions.map(o => ({
      ...o,
      selected: selected.includes(o.id),
    }))
  }, [levelOptions, selected])
  const _onChange = useCallback(
    (opts: FilterOption<Course_Level_Enum>[]) => {
      const sel = opts.flatMap(o => (o.selected ? o.id : []))
      setSelected(sel)
      onChange(sel)
    },
    [onChange, setSelected],
  )

  useEffectOnce(() => {
    onChange(selected)
  })

  return (
    <FilterAccordion
      options={options}
      title={title || t('course-level')}
      onChange={_onChange}
      data-testid="FilterByCourseLevel"
    />
  )
}
