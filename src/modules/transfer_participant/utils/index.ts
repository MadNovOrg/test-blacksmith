import { differenceInWeeks } from 'date-fns'

import {
  Course,
  CourseDeliveryType,
  CourseLevel,
  CourseType,
  Course_Level_Enum,
  TransferCourse,
} from '@app/generated/graphql'

export function isTrainTheTrainerCourse(courseLevel: Course_Level_Enum) {
  return [
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
    Course_Level_Enum.FoundationTrainerPlus,
  ].includes(courseLevel)
}

export const getTransferTermsFee = (
  startDate: Date,
  courseLevel: Course_Level_Enum,
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

export const isAddressInfoRequired = ({
  fromCourse,
  toCourse,
}: {
  [key: string]: Partial<Course | TransferCourse>
}) =>
  fromCourse.deliveryType === CourseDeliveryType.F2F &&
  fromCourse.level === CourseLevel.Level_1 &&
  [
    toCourse.type === CourseType.Open,
    toCourse.deliveryType === CourseDeliveryType.Virtual,
    toCourse.level === CourseLevel.Level_1,
  ].every(Boolean)
