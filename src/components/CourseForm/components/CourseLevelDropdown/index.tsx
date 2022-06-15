import { Select, SelectChangeEvent, MenuItem } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseLevel, CourseType } from '@app/types'

import { getLevels } from '../../helpers'

type SelectValue = CourseLevel | ''

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  courseType: CourseType
}

export const CourseLevelDropdown: React.FC<Props> = ({
  value,
  onChange,
  courseType,
}) => {
  const { t } = useTranslation()

  const levels = useMemo(() => getLevels(courseType), [courseType])
  const selected = value || levels[0]

  useEffect(() => {
    if (value !== selected) {
      const ev = { target: { value: selected } }
      onChange(ev as SelectChangeEvent<CourseLevel>)
    }
  }, [levels, onChange, value, selected])

  return (
    <Select
      value={selected}
      onChange={onChange}
      data-testid="course-level-select"
      id="course-level"
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
