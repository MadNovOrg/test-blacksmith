import { BildStrategies, CourseLevel } from '@app/types'

export type BildRatioCriteria = {
  isConversion: boolean
  isReaccreditation: boolean
  strategies: BildStrategies[]
  level: CourseLevel
  numberParticipants: number
}

export function getRequiredLeadsBild(criteria: BildRatioCriteria): {
  min: number
  max: number
} {
  const count = 1

  const withoutAdvanced =
    criteria.level === CourseLevel.BildRegular &&
    criteria.strategies.length >= 1 &&
    !criteria.strategies.includes(BildStrategies.RestrictiveTertiaryAdvanced)

  const allStrategiesSelected =
    criteria.level === CourseLevel.BildRegular &&
    Object.keys(BildStrategies).length === criteria.strategies.length

  if (criteria.isConversion) {
    return toRange(1)
  }

  if (
    [
      CourseLevel.BildIntermediateTrainer,
      CourseLevel.BildAdvancedTrainer,
    ].includes(criteria.level) ||
    withoutAdvanced
  ) {
    return toRange(Math.ceil(criteria.numberParticipants / 12))
  }

  if (allStrategiesSelected) {
    return toRange(Math.ceil(criteria.numberParticipants / 8))
  }

  return toRange(count)
}

export function getRequiredAssistantsBild(criteria: BildRatioCriteria): {
  min: number
  max: number
} {
  const count = 0
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
    criteria.level === CourseLevel.BildIntermediateTrainer &&
    criteria.isReaccreditation &&
    criteria.numberParticipants > 12
  ) {
    return toRange(Math.abs(Math.ceil((criteria.numberParticipants - 12) / 12)))
  }

  if (
    (criteria.level === CourseLevel.BildIntermediateTrainer &&
      !criteria.isReaccreditation) ||
    criteria.level === CourseLevel.BildAdvancedTrainer ||
    withoutAdvanced
  ) {
    return toRange(Math.ceil(criteria.numberParticipants / 12))
  }

  if (allStrategiesSelected) {
    return toRange(Math.ceil(criteria.numberParticipants / 8))
  }

  return toRange(count)
}

export function toRange(count: number) {
  return { min: count, max: count }
}
