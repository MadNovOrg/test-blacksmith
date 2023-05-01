import { differenceInDays, isFuture } from 'date-fns'

import { getACL } from '@app/context/auth/permissions'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import {
  CourseDeliveryType,
  CourseLevel,
  CourseTrainerType,
  CourseType,
} from '@app/types'
import {
  getRequiredAssistants,
  TrainerRatioCriteria,
} from '@app/util/trainerRatio'

export enum CourseException {
  ADVISED_TIME_EXCEEDED = 'ADVISED_TIME_EXCEEDED',
  OUTSIDE_NOTICE_PERIOD = 'OUTSIDE_NOTICE_PERIOD',
  LEAD_TRAINER_IN_GRACE_PERIOD = 'LEAD_TRAINER_IN_GRACE_PERIOD',
  TRAINER_RATIO_NOT_MET = 'TRAINER_RATIO_NOT_MET',
}

const CourseLevelTrainerLevels = {
  [CourseLevel.Level_1]: [
    CourseLevel.IntermediateTrainer,
    CourseLevel.AdvancedTrainer,
  ],
  [CourseLevel.Level_2]: [
    CourseLevel.IntermediateTrainer,
    CourseLevel.AdvancedTrainer,
  ],
  [CourseLevel.Advanced]: [CourseLevel.IntermediateTrainer],
  [CourseLevel.BildRegular]: [CourseLevel.BildRegular],
  [CourseLevel.IntermediateTrainer]: [
    CourseLevel.IntermediateTrainer,
    CourseLevel.AdvancedTrainer,
  ],
  [CourseLevel.AdvancedTrainer]: [CourseLevel.AdvancedTrainer],
  [CourseLevel.BildIntermediateTrainer]: [CourseLevel.BildIntermediateTrainer],
  [CourseLevel.BildAdvancedTrainer]: [CourseLevel.BildAdvancedTrainer],
}

const MIN_DURATION_FOR_TIME_COMMITMENT = 6 * 60 // 6h

export type CourseData = {
  startDateTime: Date
  courseLevel: CourseLevel | Course_Level_Enum
  type: CourseType | Course_Type_Enum
  deliveryType: CourseDeliveryType | Course_Delivery_Type_Enum
  reaccreditation: boolean
  maxParticipants: number
  modulesDuration?: number
  hasSeniorOrPrincipalLeader: boolean
}
export type TrainerData = {
  type: Course_Trainer_Type_Enum | CourseTrainerType
  levels: {
    courseLevel: CourseLevel
    expiryDate: string
  }[]
}[]

export const isOutsideOfNoticePeriod = (
  courseData: Pick<CourseData, 'startDateTime'>
) => {
  return differenceInDays(courseData.startDateTime, new Date()) < 4 * 7
}

export const isLeadTrainerInGracePeriod = (
  courseData: Pick<CourseData, 'courseLevel'>,
  trainers: TrainerData
) => {
  const leader = trainers.find(t => {
    return t.type === Course_Trainer_Type_Enum.Leader
  })
  if (!leader) return false
  const allowedLevels = CourseLevelTrainerLevels[courseData.courseLevel]
  const matchingLevels = leader.levels.filter(
    l => allowedLevels.indexOf(l.courseLevel) != -1
  )
  const result = !matchingLevels.some(level =>
    isFuture(new Date(level.expiryDate))
  )
  return result
}

export const isTrainersRatioNotMet = (
  courseData: TrainerRatioCriteria,
  trainers: TrainerData
) => {
  const { min } = getRequiredAssistants(courseData)
  const missingAssistants =
    trainers.filter(t => t.type === Course_Trainer_Type_Enum.Assistant).length <
    min
  return missingAssistants
}

export const isAdvisedTimeExceeded = (courseData: CourseData) => {
  return (
    courseData.modulesDuration !== undefined &&
    courseData.modulesDuration > MIN_DURATION_FOR_TIME_COMMITMENT
  )
}

export function checkCourseDetailsForExceptions(
  courseData: CourseData,
  trainerData: TrainerData
): CourseException[] {
  const exceptions: CourseException[] = []

  if (isOutsideOfNoticePeriod(courseData)) {
    exceptions.push(CourseException.OUTSIDE_NOTICE_PERIOD)
  }

  if (isLeadTrainerInGracePeriod(courseData, trainerData)) {
    exceptions.push(CourseException.LEAD_TRAINER_IN_GRACE_PERIOD)
  }

  if (isTrainersRatioNotMet(courseData, trainerData)) {
    exceptions.push(CourseException.TRAINER_RATIO_NOT_MET)
  }

  // Temporarily disabled (check TTHP-575)
  // if (isAdvisedTimeExceeded(courseData)) {
  //   exceptions.push(CourseException.ADVISED_TIME_EXCEEDED)
  // }

  return exceptions
}

export function shouldGoIntoExceptionApproval(
  acl: ReturnType<typeof getACL>,
  type: Course_Type_Enum | CourseType
) {
  if (type === Course_Type_Enum.Open) return false
  if (type === Course_Type_Enum.Closed) return true
  return !acl.isTTAdmin()
}
