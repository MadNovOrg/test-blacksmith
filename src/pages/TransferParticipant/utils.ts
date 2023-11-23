import { differenceInWeeks } from 'date-fns'

import { Course_Level_Enum } from '@app/generated/graphql'

export function isTrainTheTrainerCourse(courseLevel: Course_Level_Enum) {
  return [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ].includes(courseLevel)
}

export const getTransferTermsFee = (
  startDate: Date,
  courseLevel: Course_Level_Enum
): 0 | 15 | 25 | 50 => {
  const diffInWeeks = differenceInWeeks(startDate, new Date())
  const isTrainTheTrainerLevel = isTrainTheTrainerCourse(courseLevel)

  if (isTrainTheTrainerLevel) {
    if (diffInWeeks < 1) {
      return 50
    }

    if (diffInWeeks < 4) {
      return 25
    }

    return 0
  }

  if (diffInWeeks < 2) {
    return 25
  }

  if (diffInWeeks < 4) {
    return 15
  }

  return 0
}
