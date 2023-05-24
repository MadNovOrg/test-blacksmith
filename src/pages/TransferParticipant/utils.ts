import { differenceInWeeks } from 'date-fns'

import { CourseLevel } from '@app/generated/graphql'

export function isTrainTheTrainerCourse(courseLevel: CourseLevel) {
  return [
    CourseLevel.IntermediateTrainer,
    CourseLevel.AdvancedTrainer,
    CourseLevel.BildIntermediateTrainer,
    CourseLevel.BildAdvancedTrainer,
  ].includes(courseLevel)
}

export const getTransferTermsFee = (
  startDate: Date,
  courseLevel: CourseLevel
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
