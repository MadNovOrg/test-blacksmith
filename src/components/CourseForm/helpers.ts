import { format } from 'date-fns'

import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

import aolRegionsByCountry from './aolRegions'

export function makeDate(date: Date | string | null, time: Date | string) {
  try {
    const _date = new Date(date || Date.now())
    return new Date(`${format(_date, 'yyyy-MM-dd')} ${time}`)
  } catch (e) {
    return null
  }
}

export function extractTime(date: Date | string | null) {
  try {
    return format(new Date(date || Date.now()), 'HH:mm')
  } catch (e) {
    return ''
  }
}

export function getLevels(courseType: CourseType) {
  const types = {
    [CourseType.OPEN]: () => {
      return [
        CourseLevel.Level_1,
        CourseLevel.IntermediateTrainer,
        CourseLevel.AdvancedTrainer,
      ]
    },

    [CourseType.CLOSED]: () => {
      return [
        CourseLevel.Level_1,
        CourseLevel.Level_2,
        CourseLevel.Advanced,
        CourseLevel.IntermediateTrainer,
        CourseLevel.AdvancedTrainer,
      ]
    },

    [CourseType.INDIRECT]: () => {
      return [CourseLevel.Level_1, CourseLevel.Level_2, CourseLevel.Advanced]
    },
  }

  return types[courseType]()
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

      if (isF2F) {
        // OPEN + F2F can never be blended
      }

      if (isMixed) {
        // OPEN + Mixed can never be blended
      }

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
          CourseLevel.IntermediateTrainer,
          CourseLevel.AdvancedTrainer,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isMixed) {
        // OPEN + Mixed can never be reaccreditation
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
        const levels = [CourseLevel.Level_1]
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

export function canBeF2F(
  courseType: CourseType,
  courseLevel: CourseLevel | ''
) {
  const types = {
    [CourseType.OPEN]: () => {
      if (!courseLevel) return false

      const levels = [
        CourseLevel.Level_1,
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
      return false
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

export function getAccountCode(): string {
  const d = new Date()
  const month = format(d, 'MMM')
  const year = format(d, 'yy')

  return `810A ${month}${year}`
}
