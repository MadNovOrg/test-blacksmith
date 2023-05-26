import { BildStrategies, CourseLevel } from '@app/types'

export type BildRatioCriteria = {
  isConversion: boolean
  isReaccreditation: boolean
  strategies: BildStrategies[]
  level: CourseLevel
  numberParticipants: number
}

export function getRequiredLeadsBild(_criteria: BildRatioCriteria): {
  min: number
  max: number
} {
  return toRange(1)
}

export function getRequiredAssistantsBild(criteria: BildRatioCriteria): {
  min: number
  max: number
} {
  const withoutAdvanced =
    criteria.level === CourseLevel.BildRegular &&
    criteria.strategies.length >= 1 &&
    !criteria.strategies.includes(BildStrategies.RestrictiveTertiaryAdvanced)

  const allStrategiesSelected =
    criteria.level === CourseLevel.BildRegular &&
    Object.keys(BildStrategies).length === criteria.strategies.length

  if (criteria.isConversion) {
    return toRange(Math.abs(Math.ceil((criteria.numberParticipants - 12) / 12)))
  }

  if (
    (withoutAdvanced ||
      [
        CourseLevel.BildIntermediateTrainer,
        CourseLevel.BildAdvancedTrainer,
      ].includes(criteria.level)) &&
    criteria.numberParticipants > 12
  ) {
    return toRange(Math.abs(Math.ceil((criteria.numberParticipants - 12) / 12)))
  }

  if (
    allStrategiesSelected &&
    criteria.level === CourseLevel.BildRegular &&
    criteria.numberParticipants > 8
  ) {
    return toRange(Math.abs(Math.ceil((criteria.numberParticipants - 8) / 8)))
  }

  return toRange(0)
}

export function toRange(count: number) {
  return { min: count, max: count }
}
