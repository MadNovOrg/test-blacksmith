import { SxProps } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { Course_Type_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  onChange: (selected: Course_Type_Enum[]) => void
  sx?: SxProps
  courseTypeBlacklist?: Course_Type_Enum
}

const types = Object.values(Course_Type_Enum)

const CourseTypeParam = withDefault(
  createEnumArrayParam<Course_Type_Enum>(types),
  [] as Course_Type_Enum[],
)

export const FilterByCourseType: React.FC<React.PropsWithChildren<Props>> = ({
  onChange = noop,
  sx,
  courseTypeBlacklist,
}) => {
  const { t } = useTranslation()

  const typeOptions = useMemo(() => {
    return types.map(type => ({
      id: type,
      title: t(`course-types.${type}`),
    }))
  }, [t])

  const [selected, setSelected] = useQueryParam('type', CourseTypeParam)

  const options = useMemo(() => {
    if (courseTypeBlacklist) {
      return typeOptions
        .filter(o => o.id !== courseTypeBlacklist)
        .map(o => ({
          ...o,
          selected: selected.includes(o.id),
        }))
    } else {
      return typeOptions.map(o => ({
        ...o,
        selected: selected.includes(o.id),
      }))
    }
  }, [selected, typeOptions, courseTypeBlacklist])

  const _onChange = useCallback(
    (opts: FilterOption<Course_Type_Enum>[]) => {
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
      sx={sx}
      options={options}
      title={t('course-type')}
      onChange={_onChange}
      data-testid="FilterByCourseType"
    />
  )
}
