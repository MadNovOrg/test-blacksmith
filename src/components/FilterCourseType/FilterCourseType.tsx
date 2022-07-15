import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Type_Enum } from '@app/generated/graphql'
import { noop } from '@app/util'

import { FilterAccordion, FilterOption } from '../FilterAccordion'

type Props = {
  onChange: (selected: Course_Type_Enum[]) => void
}

const types = Object.values(Course_Type_Enum)

export const FilterCourseType: React.FC<Props> = ({ onChange = noop }) => {
  const { t } = useTranslation()

  const [options, setOptions] = useState<FilterOption<Course_Type_Enum>[]>(
    () => {
      return types.map(type => ({
        id: type,
        title: t(`course-types.${type}`),
        selected: false,
      }))
    }
  )

  const _onChange = useCallback(
    (opts: FilterOption<Course_Type_Enum>[]) => {
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
