import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { ratio, TrainerRatio } from '@app/util/trainerRatio/trainerRatio.icm'

export type BildRatioCriteria = {
  isReaccreditation: boolean
  level: Course_Level_Enum
  numberParticipants: number
  type: Course_Type_Enum
}

export function toRange(count: number) {
  return { min: count, max: count }
}

const getTrainerRatioBILD = (criteria: BildRatioCriteria): TrainerRatio => {
  const { level, type, isReaccreditation } = criteria

  if (
    type === Course_Type_Enum.Indirect &&
    level === Course_Level_Enum.BildRegular &&
    !isReaccreditation
  ) {
    return ratio(1, 24, 12)
  }
  if (
    [
      Course_Level_Enum.BildRegular,
      Course_Level_Enum.BildIntermediateTrainer,
    ].includes(level)
  )
    return ratio(0, 12, 12)

  if (level === Course_Level_Enum.BildAdvancedTrainer) return ratio(1, 12, 12)

  return ratio(1, 12, 12)
}

export function getRequiredAssistantsBild(criteria: BildRatioCriteria): {
  min: number
  max: number
} {
  const ratio = getTrainerRatioBILD(criteria)

  const { numberParticipants } = criteria
  let assistants = ratio.initialAssistants

  if (numberParticipants > ratio.threshold) {
    const overThreshold = numberParticipants - ratio.threshold
    assistants += Math.ceil(overThreshold / ratio.increment)
  }

  return toRange(assistants)
}
