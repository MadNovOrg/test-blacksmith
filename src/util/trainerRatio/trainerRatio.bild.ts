import { Course_Level_Enum } from '@app/generated/graphql'
import { BildStrategies, CourseType } from '@app/types'

export type BildRatioCriteria = {
  isConversion: boolean
  isReaccreditation: boolean
  strategies: BildStrategies[]
  level: Course_Level_Enum
  numberParticipants: number
  type: CourseType
}

export function getRequiredLeadsBild(criteria: BildRatioCriteria): {
  min: number
  max: number
} {
  return criteria.type === CourseType.OPEN ? { min: 0, max: 1 } : toRange(1)
}

export function getRequiredAssistantsBild(criteria: BildRatioCriteria): {
  min: number
  max: number
} {
  const withoutAdvanced =
    criteria.level === Course_Level_Enum.BildRegular &&
    criteria.strategies.length >= 1 &&
    !criteria.strategies.includes(BildStrategies.RestrictiveTertiaryAdvanced)

  const advancedSelected =
    criteria.level === Course_Level_Enum.BildRegular &&
    criteria.strategies.includes(BildStrategies.RestrictiveTertiaryAdvanced)

  if (criteria.isConversion) {
    return toRange(Math.abs(Math.ceil((criteria.numberParticipants - 12) / 12)))
  }

  if (
    (withoutAdvanced ||
      [
        Course_Level_Enum.BildIntermediateTrainer,
        Course_Level_Enum.BildAdvancedTrainer,
      ].includes(criteria.level)) &&
    criteria.numberParticipants > 12
  ) {
    return toRange(Math.abs(Math.ceil((criteria.numberParticipants - 12) / 12)))
  }

  if (
    advancedSelected &&
    criteria.level === Course_Level_Enum.BildRegular &&
    criteria.numberParticipants > 8
  ) {
    return toRange(Math.abs(Math.ceil((criteria.numberParticipants - 8) / 8)))
  }

  return toRange(0)
}

export function toRange(count: number) {
  return { min: count, max: count }
}
