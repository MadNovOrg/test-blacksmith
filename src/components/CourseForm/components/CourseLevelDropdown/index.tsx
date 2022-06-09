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

type Option = { value: CourseLevel; label: string }
type OptionsMap = Record<CourseLevel, Option>

export const CourseLevelDropdown: React.FC<Props> = ({
  value,
  onChange,
  courseType,
  deliveryType,
}) => {
  const { t } = useTranslation()

  const options: Option[] = useMemo(() => {
    const opts = Object.values(CourseLevel).reduce((acc, level) => {
      const opt = { value: level, label: t(`common.course-levels.${level}`) }
      return { ...acc, [level]: opt }
    }, {} as OptionsMap)

    return getOptions(opts, courseType, deliveryType)
  }, [deliveryType, courseType, t])

  return (
    <Select
      value={value}
      onChange={onChange}
      data-testid="course-level-select"
      id="course-level"
    >
      {options.map(option => (
        <MenuItem
          key={option.value}
          value={option.value}
          data-testid={`course-level-option-${option.value}`}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}

/**
 * Helpers
 */

function getOptions(
  opts: OptionsMap,
  courseType: CourseType,
  deliveryType: CourseDeliveryType
) {
  const isF2F = deliveryType === CourseDeliveryType.F2F
  const isMixed = deliveryType === CourseDeliveryType.MIXED
  const isVirtual = deliveryType === CourseDeliveryType.VIRTUAL

  const types = {
    [CourseType.OPEN]: () => {
      if (isMixed) {
        return []
      }

      if (isVirtual) {
        return [opts.LEVEL_1]
      }

      if (isF2F) {
        // return same as if delivery not set
      }

      return [opts.LEVEL_1, opts.INTERMEDIATE_TRAINER, opts.ADVANCED_TRAINER]
    },

    [CourseType.CLOSED]: () => {
      if (isMixed) {
        return [opts.LEVEL_1, opts.LEVEL_2]
      }

      if (isVirtual) {
        return [opts.LEVEL_1]
      }

      if (isF2F) {
        // return same as if delivery not set
      }

      return [
        opts.LEVEL_1,
        opts.LEVEL_2,
        opts.ADVANCED,
        opts.INTERMEDIATE_TRAINER,
        opts.ADVANCED_TRAINER,
      ]
    },

    [CourseType.INDIRECT]: () => {
      if (isMixed) {
        return [opts.LEVEL_1, opts.LEVEL_2]
      }

      if (isVirtual) {
        return [opts.LEVEL_1]
      }

      if (isF2F) {
        // return same as if delivery not set
      }

      return [opts.LEVEL_1, opts.LEVEL_2, opts.ADVANCED]
    },
  } as Record<CourseType, () => Option[]>

  return types[courseType]()
}
