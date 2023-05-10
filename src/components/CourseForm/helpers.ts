import { format, isValid, isBefore, isEqual } from 'date-fns'
import { TFunction } from 'i18next'

import { Accreditors_Enum } from '@app/generated/graphql'
import {
  BildStrategies,
  CourseDeliveryType,
  CourseLevel,
  CourseType,
} from '@app/types'

import aolRegionsByCountry from './aolRegions'

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
        CourseLevel.Level_1,
        CourseLevel.Level_2,
        CourseLevel.IntermediateTrainer,
        CourseLevel.AdvancedTrainer,
      ]
    },

    [`${Accreditors_Enum.Icm}-${CourseType.CLOSED}`]: () => {
      return [
        CourseLevel.Level_1,
        CourseLevel.Level_2,
        CourseLevel.Advanced,
        CourseLevel.IntermediateTrainer,
        CourseLevel.AdvancedTrainer,
      ]
    },

    [`${Accreditors_Enum.Icm}-${CourseType.INDIRECT}`]: () => {
      return [CourseLevel.Level_1, CourseLevel.Level_2, CourseLevel.Advanced]
    },

    [`${Accreditors_Enum.Bild}-${CourseType.INDIRECT}`]: () => {
      return [CourseLevel.BildRegular]
    },

    [`${Accreditors_Enum.Bild}-${CourseType.OPEN}`]: () => {
      return [
        CourseLevel.BildIntermediateTrainer,
        CourseLevel.BildAdvancedTrainer,
      ]
    },
    [`${Accreditors_Enum.Bild}-${CourseType.CLOSED}`]: () => {
      return [
        CourseLevel.BildIntermediateTrainer,
        CourseLevel.BildAdvancedTrainer,
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
    case CourseType.INDIRECT: {
      return (
        selectedStrategies.includes(BildStrategies.Primary) &&
        selectedStrategies.length === 1
      )
    }
  }

  return false
}

export function canBeBlended(
  courseType: CourseType,
  courseLevel: CourseLevel | '',
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
        const levels = [CourseLevel.Level_1, CourseLevel.Level_2]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        // CLOSED + Mixed can never be blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.Level_1]
        return levels.includes(courseLevel)
      }

      return false
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [CourseLevel.Level_1, CourseLevel.Level_2]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        // INDIRECT + Mixed can never be blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.Level_1]
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
  blended: boolean
): boolean {
  switch (courseType) {
    case CourseType.INDIRECT: {
      if (!strategies) {
        return false
      }
      const selectedStrategies = Object.keys(strategies).filter(
        strategy => strategies[strategy as BildStrategies] === true
      )

      return (
        selectedStrategies.length === 1 &&
        selectedStrategies.includes(BildStrategies.Primary)
      )
    }

    case CourseType.OPEN:
    case CourseType.CLOSED: {
      if (blended) {
        return false
      }

      return true
    }
  }
}

export function canBeReacc(
  courseType: CourseType,
  courseLevel: CourseLevel | '',
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
          CourseLevel.Level_2,
          CourseLevel.IntermediateTrainer,
          CourseLevel.AdvancedTrainer,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isMixed && courseLevel === CourseLevel.Level_2) {
        return !blended
        // OPEN + Mixed can only be Level 2
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
          CourseLevel.Level_1,
          CourseLevel.IntermediateTrainer,
          CourseLevel.AdvancedTrainer,
        ]
        if (levels.includes(courseLevel)) return !blended
        if (courseLevel === CourseLevel.Level_2) return true
      }

      if (isMixed) {
        const levels = [CourseLevel.Level_1, CourseLevel.Level_2]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.Level_1]
        if (levels.includes(courseLevel)) return !blended
      }

      return false
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [CourseLevel.Level_1, CourseLevel.BildRegular]
        if (levels.includes(courseLevel)) return !blended
        if (courseLevel === CourseLevel.Level_2) return true
      }

      if (isMixed) {
        const levels = [CourseLevel.Level_1, CourseLevel.Level_2]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isVirtual) {
        const levels = [CourseLevel.Level_1]
        if (levels.includes(courseLevel)) return !blended
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
  courseLevel: CourseLevel | ''
): boolean {
  switch (courseType) {
    case CourseType.INDIRECT: {
      return true
    }

    case CourseType.OPEN:
    case CourseType.CLOSED: {
      return courseLevel === CourseLevel.BildIntermediateTrainer
    }
  }
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
    case CourseType.INDIRECT: {
      return (
        selectedStrategies.includes(BildStrategies.Primary) &&
        selectedStrategies.length === 1
      )
    }
  }

  return false
}

export function canBeF2F(
  courseType: CourseType,
  courseLevel: CourseLevel | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [
        CourseLevel.Level_1,
        CourseLevel.Level_2,
        CourseLevel.IntermediateTrainer,
        CourseLevel.AdvancedTrainer,
      ]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [
        CourseLevel.Level_1,
        CourseLevel.Level_2,
        CourseLevel.Advanced,
        CourseLevel.IntermediateTrainer,
        CourseLevel.AdvancedTrainer,
      ]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [
        CourseLevel.Level_1,
        CourseLevel.Level_2,
        CourseLevel.Advanced,
      ]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeMixed(
  courseType: CourseType,
  courseLevel: CourseLevel | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.Level_2]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.Level_1, CourseLevel.Level_2]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.Level_1, CourseLevel.Level_2]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeVirtual(
  courseType: CourseType,
  courseLevel: CourseLevel | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.Level_1]
      return levels.includes(courseLevel)
    },

    [CourseType.CLOSED]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.Level_1]
      return levels.includes(courseLevel)
    },

    [CourseType.INDIRECT]: () => {
      if (!courseLevel) return false

      const levels = [CourseLevel.Level_1]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function getAOLCountries() {
  return Object.keys(aolRegionsByCountry)
}

export function getAOLRegions(country: string | null): string[] {
  const validCountries = getAOLCountries()

  if (!country || !validCountries.includes(country)) {
    return []
  }

  return aolRegionsByCountry[country as keyof typeof aolRegionsByCountry]
}

export function getAccountCode(d = new Date()): string {
  const month = format(d, 'MMM')
  const year = format(d, 'yy')

  return `810A ${month}${year}`
}

export function getDefaultSpecialInstructions(
  type: CourseType,
  level: CourseLevel | '',
  deliveryType: CourseDeliveryType,
  reaccreditation: boolean,
  t: TFunction
) {
  const keyPrefixPath =
    'components.course-form.special-instructions.instructions'
  let key = `${keyPrefixPath}.${type}.${level}`

  if (level === CourseLevel.Level_1) {
    key = `${key}.${deliveryType}`
  } else if (level === CourseLevel.Level_2) {
    key = `${key}.default`
  } else if (reaccreditation) {
    key = `${key}.reaccreditation`
  } else {
    key = `${key}.default`
  }

  const translation = t(key)
  return translation
}
