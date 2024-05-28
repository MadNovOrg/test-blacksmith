import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { RequiredTrainers } from './types'

const { Indirect, Open, Closed } = Course_Type_Enum

const {
  Advanced,
  AdvancedTrainer,
  IntermediateTrainer,
  Level_1,
  Level_1Bs,
  Level_2,
  FoundationTrainerPlus,
} = Course_Level_Enum

export type TrainerRatio = {
  initialAssistants: number
  threshold: number
  increment: number
}

export type TrainerRatioCriteria = {
  courseLevel: Course_Level_Enum
  deliveryType: Course_Delivery_Type_Enum
  maxParticipants: number
  reaccreditation: boolean
  type: Course_Type_Enum
  usesAOL?: boolean
}

export const ratio = (
  initialAssistants: number,
  threshold: number,
  increment: number
): TrainerRatio => ({
  initialAssistants,
  threshold,
  increment,
})

const getTrainerRatio = (criteria: TrainerRatioCriteria): TrainerRatio => {
  const { type, courseLevel, deliveryType, reaccreditation, usesAOL } = criteria

  if (type === Open && deliveryType === Course_Delivery_Type_Enum.Virtual)
    return ratio(0, 24, 12)

  if (type === Indirect) {
    if (
      (courseLevel === Level_1 || courseLevel === Level_2) &&
      !reaccreditation &&
      !usesAOL
    ) {
      return ratio(1, 24, 12)
    }

    if (courseLevel === Advanced) {
      return ratio(1, 8, 8)
    }

    if (courseLevel === Level_1Bs) {
      return ratio(1, 18, 12)
    }
  }

  if (
    [IntermediateTrainer, Level_1, Level_2, FoundationTrainerPlus].includes(
      courseLevel
    )
  ) {
    return ratio(0, 12, 12)
  }

  if (courseLevel === Advanced) return ratio(0, 8, 8)

  if (courseLevel === AdvancedTrainer) {
    if (type === Open) return ratio(1, 12, 12)

    if (type === Closed) return ratio(1, 24, 12)
  }

  if (courseLevel === Level_1Bs) return ratio(0, 18, 18)

  return ratio(1, 24, 12)
}

export const getRequiredAssistants = (
  criteria: TrainerRatioCriteria
): RequiredTrainers => {
  const ratio = getTrainerRatio(criteria)
  const { maxParticipants } = criteria
  let assistants = ratio.initialAssistants
  let optionalAssistant = maxParticipants === ratio.threshold
  if (maxParticipants > ratio.threshold) {
    const overThreshold = maxParticipants - ratio.threshold
    assistants += Math.ceil(overThreshold / ratio.increment)
    if (overThreshold % ratio.increment === 0) {
      optionalAssistant = true
    }
  }

  return {
    min: assistants,
    max: optionalAssistant ? assistants + 1 : assistants,
  }
}
