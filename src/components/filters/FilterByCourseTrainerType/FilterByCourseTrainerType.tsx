import { SxProps } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEffectOnce } from 'react-use'
import {
  createEnumArrayParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'

import { Course_Trainer_Type_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../../FilterAccordion'

type Props = {
  onChange: (selected: Course_Trainer_Type_Enum[]) => void
  includeModerator?: boolean
  sx?: SxProps
}

const CourseTrainerTypeParam = withDefault(
  createEnumArrayParam<Course_Trainer_Type_Enum>(
    Array.from(Object.values(Course_Trainer_Type_Enum))
  ),
  [] as Course_Trainer_Type_Enum[]
)

export const FilterByTrainerCourseType: React.FC<
  React.PropsWithChildren<Props>
> = ({ onChange = noop, sx, includeModerator = false }) => {
  const { t } = useTranslation()

  const courseTrainerTypes = useMemo(
    () => [
      Course_Trainer_Type_Enum.Leader,
      Course_Trainer_Type_Enum.Assistant,
      ...(includeModerator ? [Course_Trainer_Type_Enum.Moderator] : []),
    ],
    [includeModerator]
  )

  const trainerTypeOptions = useMemo(() => {
    return courseTrainerTypes.map(trainerType => ({
      id: trainerType,
      title: t(
        `common.course-trainer-types.${trainerType.toLocaleLowerCase()}`
      ),
    }))
  }, [courseTrainerTypes, t])

  const [selected, setSelected] = useQueryParam(
    'trainer',
    CourseTrainerTypeParam
  )

  const options = useMemo(() => {
    return trainerTypeOptions.map(option => ({
      ...option,
      selected: selected.includes(option.id),
    }))
  }, [trainerTypeOptions, selected])

  const _onChange = useCallback(
    (opts: FilterOption<Course_Trainer_Type_Enum>[]) => {
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
      sx={sx}
      options={options}
      title={t('trainer-role')}
      onChange={_onChange}
      data-testid="FilterByCourseTrainerType"
      sort={false}
    />
  )
}
