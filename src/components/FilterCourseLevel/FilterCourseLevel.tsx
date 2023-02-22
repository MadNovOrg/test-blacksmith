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

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: Course_Level_Enum[]) => void
}

const levels = Object.values(Course_Level_Enum)

const CourseLevelParam = withDefault(
  createEnumArrayParam<Course_Level_Enum>(levels),
  [] as Course_Level_Enum[]
)

export const FilterCourseLevel: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
}) => {
  const { t } = useTranslation()

  const levelOptions = useMemo(() => {
    return levels.map(level => ({
      id: level,
      title: t(`course-levels.${level}`),
    }))
  }, [t])

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
    [onChange, setSelected]
  )

  useEffectOnce(() => {
    onChange(selected)
  })

  return (
    <FilterAccordion
      options={options}
      title={t('level')}
      onChange={_onChange}
      data-testid="FilterCourseLevel"
    />
  )
}
