import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

type TrainerRatio = {
  initialAssistants: number
  threshold: number
  increment: number
}

export type TrainerRatioCriteria = {
  courseLevel: Course_Level_Enum | CourseLevel
  type: Course_Type_Enum | CourseType
  deliveryType: Course_Delivery_Type_Enum | CourseDeliveryType
  reaccreditation: boolean
  maxParticipants: number
  hasSeniorOrPrincipalLeader: boolean
}

export type RequiredAssistants = {
  min: number
  max: number
}

const ratio = (
  initialAssistants: number,
  threshold: number,
  increment: number
): TrainerRatio => ({
  initialAssistants,
  threshold,
  increment,
})

const getTrainerRatio = (criteria: TrainerRatioCriteria): TrainerRatio => {
  if (criteria.courseLevel === Course_Level_Enum.Level_1) {
    if (criteria.reaccreditation || criteria.hasSeniorOrPrincipalLeader) {
      return ratio(0, 12, 12)
    }
    if (criteria.type === Course_Type_Enum.Open) {
      return ratio(0, 24, 12)
    }
    if (criteria.deliveryType === Course_Delivery_Type_Enum.Virtual) {
      return ratio(1, 24, 12)
    }
    return ratio(1, 12, 12)
  } else if (criteria.courseLevel === Course_Level_Enum.Level_2) {
    if (!criteria.reaccreditation && !criteria.hasSeniorOrPrincipalLeader) {
      return ratio(1, 24, 12)
    }
    return ratio(0, 12, 12)
  } else if (criteria.courseLevel === Course_Level_Enum.Advanced) {
    if (criteria.hasSeniorOrPrincipalLeader) {
      return ratio(0, 8, 8)
    }
    return ratio(1, 16, 8)
  }
  return ratio(1, 24, 12)
}

export const getRequiredAssistants = (
  criteria: TrainerRatioCriteria
): RequiredAssistants => {
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
