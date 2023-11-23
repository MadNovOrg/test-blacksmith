import { format, isValid, isBefore, isEqual, getYear } from 'date-fns'
import { TFunction } from 'i18next'

import { Accreditors_Enum, Course_Level_Enum } from '@app/generated/graphql'
import {
  BildStrategies,
  CourseDeliveryType,
  CourseInput,
  CourseType,
} from '@app/types'

function parseTime(time: string) {
  let hours = 0
  let minutes = 0
  const hoursAndMinutes = time.split(':')

  if (hoursAndMinutes.length === 2) {
    hours = Number(hoursAndMinutes[0])
    minutes = Number(hoursAndMinutes[1])
  }

  return { hours, minutes }
}

export function makeDate(date: Date | string | null, time: string) {
  try {
    const _date = new Date(date || Date.now())
    const { hours, minutes } = parseTime(time)

    return new Date(new Date(_date).setHours(hours, minutes, 0, 0))
  } catch (e) {
    return null
  }
}

export function isEndDateTimeBeforeStartDateTime(
  startDate: Date | null,
  startTime: string,
  endDate: Date | null,
  endTime: string
) {
  if (isValid(startDate) && startTime && isValid(endDate) && endTime) {
    const startDateTime = makeDate(startDate, startTime)
    const endDateTime = makeDate(endDate, endTime)
    return (
      startDateTime &&
      endDateTime &&
      (isEqual(endDateTime, startDateTime) ||
        isBefore(endDateTime, startDateTime))
    )
  }
}

export function getLevels(
  courseType: CourseType,
  courseAccreditor: Accreditors_Enum
) {
  const types = {
    [`${Accreditors_Enum.Icm}-${CourseType.OPEN}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.ThreeDaySafetyResponseTrainer,
      ]
    },

    [`${Accreditors_Enum.Icm}-${CourseType.CLOSED}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
      ]
    },

    [`${Accreditors_Enum.Icm}-${CourseType.INDIRECT}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
      ]
    },

    [`${Accreditors_Enum.Bild}-${CourseType.INDIRECT}`]: () => {
      return [Course_Level_Enum.BildRegular]
    },

    [`${Accreditors_Enum.Bild}-${CourseType.OPEN}`]: () => {
      return [
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ]
    },
    [`${Accreditors_Enum.Bild}-${CourseType.CLOSED}`]: () => {
      return [
        Course_Level_Enum.BildRegular,
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ]
    },
  }

  return types[`${courseAccreditor}-${courseType}`]()
}

export function canBeBlendedBild(
  courseType: CourseType,
  strategies: Record<BildStrategies, boolean> | null
): boolean {
  if (!strategies) {
    return false
  }

  const selectedStrategies = Object.keys(strategies).filter(
    strategy => strategies[strategy as BildStrategies] === true
  )

  switch (courseType) {
    case CourseType.INDIRECT:
    case CourseType.CLOSED: {
      return selectedStrategies.includes(BildStrategies.Primary)
    }
  }

  return false
}

export function canBeBlended(
  courseType: CourseType,
  courseLevel: Course_Level_Enum | '',
  deliveryType: CourseDeliveryType
) {
  const isF2F = deliveryType === CourseDeliveryType.F2F
  const isMixed = deliveryType === CourseDeliveryType.MIXED
  const isVirtual = deliveryType === CourseDeliveryType.VIRTUAL

  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      if (isVirtual) {
        // OPEN + Virtual can never be blended
      }

      return false
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        if (courseLevel === Course_Level_Enum.Level_2) {
          return true
        }
        return false
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1]
        return levels.includes(courseLevel)
      }

      return false
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        return false
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1]
        return levels.includes(courseLevel)
      }

      return false
    },
  }

  return types[courseType]()
}

export function canBeReaccBild(
  courseType: CourseType,
  strategies: Record<BildStrategies, boolean> | null,
  blended: boolean,
  conversion: boolean
): boolean {
  switch (courseType) {
    case CourseType.INDIRECT: {
      if (!strategies) {
        return false
      }
      const selectedStrategies = Object.keys(strategies).filter(
        strategy => strategies[strategy as BildStrategies] === true
      )

      return selectedStrategies.length > 0
    }

    case CourseType.OPEN:
    case CourseType.CLOSED: {
      if (blended || conversion) {
        return false
      }

      return true
    }
  }
}

export function canBeReacc(
  courseType: CourseType,
  courseLevel: Course_Level_Enum | '',
  deliveryType: CourseDeliveryType,
  blended: boolean
) {
  const isF2F = deliveryType === CourseDeliveryType.F2F
  const isMixed = deliveryType === CourseDeliveryType.MIXED
  const isVirtual = deliveryType === CourseDeliveryType.VIRTUAL

  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          Course_Level_Enum.Level_2,
          Course_Level_Enum.IntermediateTrainer,
          Course_Level_Enum.AdvancedTrainer,
          Course_Level_Enum.ThreeDaySafetyResponseTrainer,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isMixed) {
        // OPEN + Mixed can only be Level 2 or 3-Day Safety Responses Trainer
        const levels = [
          Course_Level_Enum.Level_2,
          Course_Level_Enum.ThreeDaySafetyResponseTrainer,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isVirtual) {
        // OPEN + Virtual can never be reaccreditation
      }

      return false
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.IntermediateTrainer,
          Course_Level_Enum.AdvancedTrainer,
        ]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
        return levels.includes(courseLevel)
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1]
        return levels.includes(courseLevel)
      }

      return false
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
        return levels.includes(courseLevel)
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1]
        return levels.includes(courseLevel)
      }

      return false
    },
  }

  return types[courseType]()
}

export function canBeF2FBild() {
  return true
}

export function canBeMixedBild(
  courseType: CourseType,
  courseLevel: Course_Level_Enum | '',
  selectedStrategies: BildStrategies[]
): boolean {
  if (courseLevel === Course_Level_Enum.BildRegular) {
    return selectedStrategies.includes(BildStrategies.Primary)
  }

  return courseLevel === Course_Level_Enum.BildIntermediateTrainer
}

export function canBeVirtualBild(
  courseType: CourseType,
  strategies: Record<BildStrategies, boolean> | null
): boolean {
  if (!strategies) {
    return false
  }

  const selectedStrategies = Object.keys(strategies).filter(
    strategy => strategies[strategy as BildStrategies] === true
  )

  switch (courseType) {
    case CourseType.INDIRECT:
    case CourseType.CLOSED: {
      return (
        selectedStrategies.includes(BildStrategies.Primary) &&
        selectedStrategies.length === 1
      )
    }
    default: {
      return false
    }
  }
}

export function canBeF2F(
  courseType: CourseType,
  courseLevel: Course_Level_Enum | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.ThreeDaySafetyResponseTrainer,
      ]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
      ]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
      ]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeMixed(
  courseType: CourseType,
  courseLevel: Course_Level_Enum | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_2,
        Course_Level_Enum.ThreeDaySafetyResponseTrainer,
      ]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeVirtual(
  courseType: CourseType,
  courseLevel: Course_Level_Enum | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [] as Course_Level_Enum[]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeConversion(
  isReaccred: boolean,
  courseLevel: CourseInput['courseLevel']
) {
  if (isReaccred || !courseLevel) {
    return false
  }

  return [
    Course_Level_Enum.BildAdvancedTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
  ].includes(courseLevel)
}

export function getAccountCode(d = new Date()): string {
  const month = format(d, 'MMM')
  const year = format(d, 'yy')

  return `810A ${month}${year}`
}

export function getDefaultSpecialInstructions(
  type: CourseType,
  level: Course_Level_Enum | '',
  deliveryType: CourseDeliveryType,
  reaccreditation: boolean,
  conversion: boolean,
  t: TFunction
) {
  const keyPrefixPath =
    'components.course-form.special-instructions.instructions'
  let key = `${keyPrefixPath}.${type}.${level}`

  if (level === Course_Level_Enum.Level_1) {
    key = `${key}.${deliveryType}`
  } else if (level === Course_Level_Enum.Level_2) {
    key = `${key}.default`
  } else if (reaccreditation) {
    key = `${key}.reaccreditation`
  } else if (conversion) {
    key = `${key}.conversion`
  } else {
    key = `${key}.default`
  }

  const translation = t(key)
  return translation
}

export function courseNeedsManualPrice({
  accreditedBy,
  blendedLearning,
  maxParticipants,
  courseType,
  courseLevel,
}: {
  accreditedBy: Accreditors_Enum
  blendedLearning: boolean
  maxParticipants: number
  courseType: CourseType
  courseLevel: Course_Level_Enum
}) {
  if (
    accreditedBy === Accreditors_Enum.Icm &&
    courseType === CourseType.CLOSED &&
    courseLevel === Course_Level_Enum.Level_2 &&
    blendedLearning &&
    maxParticipants <= 8
  ) {
    return true
  }

  return (
    [CourseType.OPEN, CourseType.CLOSED].includes(courseType) &&
    accreditedBy === Accreditors_Enum.Bild
  )
}

export function hasRenewalCycle({
  courseType,
  startDate,
  courseLevel,
}: {
  courseType: CourseType
  startDate: Date
  courseLevel: Course_Level_Enum
}) {
  return (
    [CourseType.OPEN, CourseType.CLOSED].includes(courseType) &&
    [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2].includes(
      courseLevel
    ) &&
    getYear(startDate) > 2023
  )
}
