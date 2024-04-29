import { Select, SelectChangeEvent, MenuItem } from '@mui/material'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { getLevels } from '../../helpers'

type SelectValue = Course_Level_Enum | ''

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  courseType: Course_Type_Enum
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

  const { acl } = useAuth()
  const foundationTrainerPlusLevelEnabled = useFeatureFlagEnabled(
    'foundation-trainer-plus-course'
  )
  const levelOneMVAEnabled = useFeatureFlagEnabled('level-one-mva')

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const levels = useMemo(
    () =>
      acl.allowedCourseLevels(
        getLevels(courseType, courseAccreditor).filter(level => {
          if (
            !foundationTrainerPlusLevelEnabled &&
            typeof foundationTrainerPlusLevelEnabled !== 'undefined' &&
            level === Course_Level_Enum.FoundationTrainerPlus
          )
            return false

          if (
            !levelOneMVAEnabled &&
            typeof levelOneMVAEnabled !== 'undefined' &&
            level === Course_Level_Enum.Level_1Mva
          )
            return false

          return true
        })
      ),
    [
      acl,
      courseType,
      courseAccreditor,
      foundationTrainerPlusLevelEnabled,
      levelOneMVAEnabled,
    ]
  )

  const selected = value && levels.includes(value) ? value : levels[0]

  useEffect(() => {
    if (levels.length > 0 && value !== selected) {
      const ev = { target: { value: selected } }
      onChange(ev as SelectChangeEvent<Course_Level_Enum>)
    }
  }, [levels, onChange, value, selected])

  useEffect(() => {
    if (onChangeRef.current) {
      onChangeRef.current({
        target: { value: selected },
      } as SelectChangeEvent<Course_Level_Enum>)
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
      {levels.map(level => {
        return (
          <MenuItem
            key={level}
            value={level}
            data-testid={`course-level-option-${level}`}
          >
            {t(`common.course-levels.${level}`)}
          </MenuItem>
        )
      })}
    </Select>
  )
}
