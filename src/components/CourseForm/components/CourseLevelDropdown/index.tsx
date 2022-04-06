import { Select, SelectChangeEvent, MenuItem } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

type SelectValue = CourseLevel | ''

interface Props {
  value: SelectValue
  onChange: (event: SelectChangeEvent<SelectValue>) => void
  courseType: CourseType
  deliveryType: CourseDeliveryType
}

type Options = Array<{ value: CourseLevel; label: string }>

export const CourseLevelDropdown: React.FC<Props> = ({
  value,
  onChange,
  courseType,
  deliveryType,
}) => {
  const { t } = useTranslation()

  const options: Options = useMemo(() => {
    const levelOneOption = {
      value: CourseLevel.LEVEL_1,
      label: t('common.course-levels.LEVEL_1'),
    }

    const levelTwoOption = {
      value: CourseLevel.LEVEL_2,
      label: t('common.course-levels.LEVEL_2'),
    }

    const advancedOption = {
      value: CourseLevel.ADVANCED,
      label: t('common.course-levels.ADVANCED'),
    }

    if (deliveryType === CourseDeliveryType.VIRTUAL) {
      return [levelOneOption]
    }

    if (
      deliveryType === CourseDeliveryType.F2F &&
      courseType === CourseType.OPEN
    ) {
      return [levelOneOption, levelTwoOption]
    }

    if (
      deliveryType === CourseDeliveryType.F2F &&
      [CourseType.CLOSED, CourseType.INDIRECT].includes(courseType)
    ) {
      return [levelOneOption, levelTwoOption, advancedOption]
    }

    if (deliveryType === CourseDeliveryType.MIXED) {
      return [levelOneOption, levelTwoOption]
    }

    return []
  }, [deliveryType, courseType, t])

  return (
    <Select value={value} onChange={onChange}>
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}
