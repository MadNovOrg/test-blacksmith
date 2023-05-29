import { Select, SelectChangeEvent, MenuItem } from '@mui/material'
import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Accreditors_Enum } from '@app/generated/graphql'
import { CourseLevel, CourseType } from '@app/types'

import { getLevels } from '../../helpers'

type SelectValue = CourseLevel | ''

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  courseType: CourseType
  courseAccreditor: Accreditors_Enum
  disabled?: boolean
  labelId?: string
}

export const CourseLevelDropdown: React.FC<React.PropsWithChildren<Props>> = ({
  value,
  onChange,
  courseType,
  courseAccreditor,
  disabled = false,
  labelId,
}) => {
  const { t } = useTranslation()
  const onChangeRef = useRef<Props['onChange'] | undefined>()

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const levels = useMemo(
    () => getLevels(courseType, courseAccreditor),
    [courseType, courseAccreditor]
  )
  const selected = value && levels.includes(value) ? value : levels[0]

  useEffect(() => {
    if (value !== selected) {
      const ev = { target: { value: selected } }
      onChange(ev as SelectChangeEvent<CourseLevel>)
    }
  }, [levels, onChange, value, selected])

  useEffect(() => {
    if (onChangeRef.current) {
      onChangeRef.current({
        target: { value: selected },
      } as SelectChangeEvent<CourseLevel>)
    }
  }, [courseAccreditor, selected])

  return (
    <Select
      value={selected}
      onChange={onChange}
      data-testid="course-level-select"
      id="course-level"
      disabled={disabled}
      labelId={labelId}
    >
      {levels.map(level => (
        <MenuItem
          key={level}
          value={level}
          data-testid={`course-level-option-${level}`}
        >
          {t(`common.course-levels.${level}`)}
        </MenuItem>
      ))}
    </Select>
  )
}
