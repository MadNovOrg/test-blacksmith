import { format, getYear, isBefore, isEqual, isValid } from 'date-fns'
import { TFunction } from 'i18next'
import posthog from 'posthog-js'

import {
  UKsCountriesCodes,
  WorldCountriesCodes,
} from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  CourseLevel,
} from '@app/generated/graphql'
import { AwsRegions, BildStrategies, CourseInput } from '@app/types'

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
  endTime: string,
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
export function getANZLevels(courseType: Course_Type_Enum) {
  const types = {
    [`${Accreditors_Enum.Icm}-${Course_Type_Enum.Open}`]: () => {
      const baseLevels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.FoundationTrainerPlus,
      ]

      const expanedLevels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.FoundationTrainer,
        Course_Level_Enum.FoundationTrainerPlus,
      ]
      return posthog.getFeatureFlag('foundation-trainer-level')
        ? expanedLevels
        : baseLevels
    },

    [`${Accreditors_Enum.Icm}-${Course_Type_Enum.Closed}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.FoundationTrainerPlus,
      ]
    },

    [`${Accreditors_Enum.Icm}-${Course_Type_Enum.Indirect}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
      ]
    },
  }

  return types[`${Accreditors_Enum.Icm}-${courseType}`]()
}
export function getLevels(
  courseType: Course_Type_Enum,
  courseAccreditor: Accreditors_Enum,
) {
  const types = {
    [`${Accreditors_Enum.Icm}-${Course_Type_Enum.Open}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.FoundationTrainerPlus,
      ]
    },

    [`${Accreditors_Enum.Icm}-${Course_Type_Enum.Closed}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.FoundationTrainerPlus,
      ]
    },

    [`${Accreditors_Enum.Icm}-${Course_Type_Enum.Indirect}`]: () => {
      return [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
      ]
    },

    [`${Accreditors_Enum.Bild}-${Course_Type_Enum.Indirect}`]: () => {
      return [Course_Level_Enum.BildRegular]
    },

    [`${Accreditors_Enum.Bild}-${Course_Type_Enum.Open}`]: () => {
      return [
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ]
    },
    [`${Accreditors_Enum.Bild}-${Course_Type_Enum.Closed}`]: () => {
      return [
        Course_Level_Enum.BildRegular,
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ]
    },
  }

  return types[`${courseAccreditor}-${courseType}`]()
}

export enum Countries_Code {
  DEFAULT_RESIDING_COUNTRY = 'GB-ENG',
  IRELAND = 'IE',
  AUSTRALIA = 'AU',
}

export function canBeBlendedBild(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | CourseLevel | '',
  strategies: Record<BildStrategies, boolean> | null,
): boolean {
  if (!strategies) {
    return false
  }

  if (
    [
      Course_Level_Enum.BildIntermediateTrainer,
      Course_Level_Enum.BildAdvancedTrainer,
    ].includes(courseLevel as Course_Level_Enum)
  )
    return false

  const selectedStrategies = Object.keys(strategies).filter(
    strategy => strategies[strategy as BildStrategies] === true,
  )

  switch (courseType) {
    case Course_Type_Enum.Indirect:
    case Course_Type_Enum.Closed: {
      return selectedStrategies.includes(BildStrategies.Primary)
    }
  }

  return false
}

export function canBeBlended(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | CourseLevel | '',
  deliveryType: Course_Delivery_Type_Enum,
) {
  const isF2F = deliveryType === Course_Delivery_Type_Enum.F2F
  const isMixed = deliveryType === Course_Delivery_Type_Enum.Mixed
  const isVirtual = deliveryType === Course_Delivery_Type_Enum.Virtual

  const types = {
    [Course_Type_Enum.Open]: () => false,

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_1Bs,
          Course_Level_Enum.Level_2,
        ]
        return levels.includes(courseLevel as Course_Level_Enum)
      }

      if (isMixed) {
        const levels = [Course_Level_Enum.Level_1Bs, Course_Level_Enum.Level_2]
        return levels.includes(courseLevel as Course_Level_Enum)
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1]
        return levels.includes(courseLevel as Course_Level_Enum)
      }

      return false
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2]
        return levels.includes(courseLevel as Course_Level_Enum)
      }

      if (isMixed) {
        return false
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1]
        return levels.includes(courseLevel as Course_Level_Enum)
      }

      return false
    },
  }

  return types[courseType]()
}

export function canBeReaccBild(
  courseType: Course_Type_Enum,
  strategies: Record<BildStrategies, boolean> | null,
  blended: boolean,
  conversion: boolean,
): boolean {
  switch (courseType) {
    case Course_Type_Enum.Indirect: {
      if (!strategies) {
        return false
      }
      const selectedStrategies = Object.keys(strategies).filter(
        strategy => strategies[strategy as BildStrategies] === true,
      )

      return selectedStrategies.length > 0
    }

    case Course_Type_Enum.Open:
    case Course_Type_Enum.Closed: {
      if (blended || conversion) {
        return false
      }

      return true
    }
  }
}

export function canBeReacc(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | '',
  deliveryType: Course_Delivery_Type_Enum,
  blended: boolean,
) {
  const isF2F = deliveryType === Course_Delivery_Type_Enum.F2F
  const isMixed = deliveryType === Course_Delivery_Type_Enum.Mixed
  const isVirtual = deliveryType === Course_Delivery_Type_Enum.Virtual

  const types = {
    [Course_Type_Enum.Open]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          Course_Level_Enum.Level_2,
          Course_Level_Enum.IntermediateTrainer,
          Course_Level_Enum.AdvancedTrainer,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isMixed) {
        // OPEN + Mixed can only be Level 2 or 3-Day Safety Responses Trainer
        const levels = [
          Course_Level_Enum.Level_2,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isVirtual) {
        // OPEN + Virtual can never be reaccreditation
      }

      return false
    },

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        if (courseLevel === Course_Level_Enum.Level_1) {
          return !blended
        }

        const levels = [
          Course_Level_Enum.Level_1Bs,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.IntermediateTrainer,
          Course_Level_Enum.AdvancedTrainer,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.FoundationTrainerPlus,
          Course_Level_Enum.Level_1Bs,
          Course_Level_Enum.Level_2,
        ]
        return levels.includes(courseLevel)
      }

      if (isVirtual) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      return false
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.Level_1Bs,
        ]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.Level_1Bs,
        ]
        return levels.includes(courseLevel)
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_1Bs]
        return levels.includes(courseLevel)
      }

      return false
    },
  }

  return types[courseType]()
}

export function canBeReaccANZ(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | '',
  deliveryType: Course_Delivery_Type_Enum,
  blended: boolean,
) {
  const isF2F = deliveryType === Course_Delivery_Type_Enum.F2F
  const isMixed = deliveryType === Course_Delivery_Type_Enum.Mixed
  const isVirtual = deliveryType === Course_Delivery_Type_Enum.Virtual
  const isFTEnabled = posthog.getFeatureFlag('foundation-trainer-level')
  const types = {
    [Course_Type_Enum.Open]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          Course_Level_Enum.Level_2,
          Course_Level_Enum.IntermediateTrainer,
          Course_Level_Enum.AdvancedTrainer,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      if (isMixed) {
        // OPEN + Mixed can only be Level 2 or 3-Day Safety Responses Trainer
        const levels = [
          Course_Level_Enum.Level_2,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        if (isFTEnabled) {
          levels.push(Course_Level_Enum.FoundationTrainer)
        }
        if (levels.includes(courseLevel)) return !blended
      }

      if (isVirtual && isFTEnabled) {
        return courseLevel === Course_Level_Enum.FoundationTrainer
      }

      return false
    },

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        if (courseLevel === Course_Level_Enum.Level_1) {
          return !blended
        }

        const levels = [
          Course_Level_Enum.Level_1Bs,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.IntermediateTrainer,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_1Bs,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.FoundationTrainerPlus,
        ]
        return levels.includes(courseLevel)
      }

      if (isVirtual) {
        const levels = [
          Course_Level_Enum.Level_1,
        ]
        if (levels.includes(courseLevel)) return !blended
      }

      return false
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      if (isF2F) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.Level_1Bs,
        ]
        return levels.includes(courseLevel)
      }

      if (isMixed) {
        const levels = [
          Course_Level_Enum.Level_1,
          Course_Level_Enum.Level_2,
          Course_Level_Enum.Level_1Bs,
        ]
        return levels.includes(courseLevel)
      }

      if (isVirtual) {
        const levels = [Course_Level_Enum.Level_1, Course_Level_Enum.Level_1Bs]
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
  courseLevel: Course_Level_Enum | '',
  selectedStrategies: BildStrategies[],
  isConversion: boolean,
): boolean {
  if (courseLevel === Course_Level_Enum.BildRegular) {
    return selectedStrategies.includes(BildStrategies.Primary)
  }

  return (
    courseLevel === Course_Level_Enum.BildIntermediateTrainer || isConversion
  )
}

export function canBeVirtualBild(
  courseType: Course_Type_Enum,
  strategies: Record<BildStrategies, boolean> | null,
  isConversion: boolean,
): boolean {
  if (isConversion) {
    return true
  }
  if (!strategies) {
    return false
  }

  const selectedStrategies = Object.keys(strategies).filter(
    strategy => strategies[strategy as BildStrategies] === true,
  )

  switch (courseType) {
    case Course_Type_Enum.Indirect:
    case Course_Type_Enum.Closed: {
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
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | '',
) {
  const types = {
    [Course_Type_Enum.Open]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.FoundationTrainerPlus,
      ]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
        Course_Level_Enum.IntermediateTrainer,
        Course_Level_Enum.AdvancedTrainer,
        Course_Level_Enum.FoundationTrainerPlus,
      ]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.Advanced,
      ]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeMixed(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | '',
) {
  const types = {
    [Course_Type_Enum.Open]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_2,
        Course_Level_Enum.FoundationTrainerPlus,
      ]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.FoundationTrainerPlus,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
      ]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
      ]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeANZMixed(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | '',
) {
  const types = {
    [Course_Type_Enum.Open]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_2,
        Course_Level_Enum.FoundationTrainerPlus,
      ]

      if (posthog.getFeatureFlag('foundation-trainer-level')) {
        levels.push(Course_Level_Enum.FoundationTrainer)
      }
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_2,
        Course_Level_Enum.FoundationTrainerPlus,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
      ]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      const levels = [
        Course_Level_Enum.Level_1,
        Course_Level_Enum.Level_1Bs,
        Course_Level_Enum.Level_2,
      ]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeVirtual(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | '',
) {
  const types = {
    [Course_Type_Enum.Open]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      const levels = [] as Course_Level_Enum[]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeANZVirtual(
  courseType: Course_Type_Enum,
  courseLevel: Course_Level_Enum | '',
) {
  const types = {
    [Course_Type_Enum.Open]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1]
      if (posthog.getFeatureFlag('foundation-trainer-level')) {
        levels.push(Course_Level_Enum.FoundationTrainer)
      }
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Closed]: () => {
      if (!courseLevel) return false

      const levels = [Course_Level_Enum.Level_1]
      return levels.includes(courseLevel)
    },

    [Course_Type_Enum.Indirect]: () => {
      if (!courseLevel) return false

      const levels = [] as Course_Level_Enum[]
      return levels.includes(courseLevel)
    },
  }

  return types[courseType]()
}

export function canBeConversion(
  isReaccred: boolean,
  courseLevel: CourseInput['courseLevel'],
) {
  if (isReaccred || !courseLevel) {
    return false
  }

  return [
    Course_Level_Enum.BildAdvancedTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
  ].includes(courseLevel as Course_Level_Enum)
}

export function getAccountCode(d = new Date()): string {
  const month = format(d, 'MMM')
  const year = format(d, 'yy')

  return `810A ${month}${year}`
}

export function getDefaultSpecialInstructions(
  type: Course_Type_Enum,
  level: Course_Level_Enum | '',
  deliveryType: Course_Delivery_Type_Enum,
  reaccreditation: boolean,
  conversion: boolean,
  t: TFunction,
) {
  const keyPrefixPath =
    'components.course-form.special-instructions.instructions'
  let key = `${keyPrefixPath}.${type}.${level}`

  if (
    level === Course_Level_Enum.Level_1 ||
    level === Course_Level_Enum.FoundationTrainerPlus
  ) {
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

export function displayClosedCourseSalesRepr({
  accreditedBy,
  courseType,
  residingCountry,
  region = AwsRegions.UK,
}: {
  accreditedBy: Accreditors_Enum
  courseType: Course_Type_Enum
  residingCountry: WorldCountriesCodes
  region?: AwsRegions
}) {
  const isICMcourse = accreditedBy === Accreditors_Enum.Icm
  const isClosedCourse = courseType === Course_Type_Enum.Closed
  const isUKcountry = Object.keys(UKsCountriesCodes).includes(residingCountry)
  const isAustralia = ['AU'].includes(residingCountry)

  if (region === AwsRegions.Australia && isAustralia && isClosedCourse) {
    return true
  }

  if (isUKcountry && isClosedCourse && isICMcourse) {
    return true
  }

  return false
}

export function hasRenewalCycle({
  courseType,
  startDate,
  courseLevel,
}: {
  courseType: Course_Type_Enum
  startDate: Date
  courseLevel: Course_Level_Enum
}) {
  return (
    [Course_Type_Enum.Open, Course_Type_Enum.Closed].includes(courseType) &&
    [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2].includes(
      courseLevel,
    ) &&
    getYear(startDate) > 2023
  )
}

export const isRenewalCycleHiddenFromUI = (courseLevel: Course_Level_Enum) => {
  const levelsToHideRenewalCycle = [Course_Level_Enum.Level_1Bs]
  return levelsToHideRenewalCycle.includes(courseLevel)
}
