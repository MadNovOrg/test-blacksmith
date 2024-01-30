import { differenceInDays, isFuture } from 'date-fns'

import { getACL } from '@app/context/auth/permissions'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  CourseLevel,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { CourseTrainerType, TrainerInput } from '@app/types'
import { REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL } from '@app/util'
import {
  getRequiredAssistants,
  getRequiredLeads,
  getRequiredModerators,
  RatioCourseData,
  RatioTrainerData,
} from '@app/util/trainerRatio'

export enum CourseException {
  ADVISED_TIME_EXCEEDED = 'ADVISED_TIME_EXCEEDED',
  OUTSIDE_NOTICE_PERIOD = 'OUTSIDE_NOTICE_PERIOD',
  LEAD_TRAINER_IN_GRACE_PERIOD = 'LEAD_TRAINER_IN_GRACE_PERIOD',
  TRAINER_RATIO_NOT_MET = 'TRAINER_RATIO_NOT_MET',
}

const MIN_DURATION_FOR_TIME_COMMITMENT = 6 * 60 // 6h

export type CourseData = {
  startDateTime: Date
  courseLevel: Course_Level_Enum | CourseLevel
  type: Course_Type_Enum
  deliveryType: Course_Delivery_Type_Enum
  reaccreditation: boolean
  conversion: boolean
  maxParticipants: number
  modulesDuration?: number
  hasSeniorOrPrincipalLeader: boolean
  accreditedBy: Accreditors_Enum
  bildStrategies?: Record<string, boolean>
  usesAOL?: boolean
  isTrainer?: boolean
}
export type TrainerData = {
  type: Course_Trainer_Type_Enum | CourseTrainerType
  trainer_role_types: TrainerInput['trainer_role_types']
  levels: {
    courseLevel: Course_Level_Enum | CourseLevel
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
  const allowedLevels =
    REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL[courseData.courseLevel]
  const matchingLevels = (leader.levels ?? []).filter(
    l => allowedLevels.indexOf(l.courseLevel as Course_Level_Enum) != -1
  )
  const result = !matchingLevels.some(level =>
    isFuture(new Date(level.expiryDate))
  )
  return result
}

export const isTrainersRatioNotMet = (
  courseData: RatioCourseData,
  trainers: RatioTrainerData
) => {
  const { min } = getRequiredAssistants(courseData)
  const { min: minLead } = getRequiredLeads(courseData)
  const { min: minModerator } = getRequiredModerators(courseData)

  const missingAssistants =
    trainers.filter(t => t.type === CourseTrainerType.Assistant).length < min

  const missingLeads =
    courseData.type !== Course_Type_Enum.Indirect
      ? trainers.filter(t => t.type === CourseTrainerType.Leader).length <
        minLead
      : false

  const missingModerators =
    courseData.type === Course_Type_Enum.Open
      ? trainers.filter(t => t.type === CourseTrainerType.Moderator).length <
        minModerator
      : false

  return missingAssistants || missingLeads || missingModerators
}

export const isAdvisedTimeExceeded = (courseData: CourseData) => {
  return (
    courseData.modulesDuration !== undefined &&
    courseData.modulesDuration > MIN_DURATION_FOR_TIME_COMMITMENT
  )
}

export function checkCourseDetailsForExceptions(
  courseData: CourseData,
  trainerData: TrainerData,
  ignoreExceptions: CourseException[] = []
): CourseException[] {
  const exceptions: CourseException[] = []

  if (
    !ignoreExceptions.includes(CourseException.OUTSIDE_NOTICE_PERIOD) &&
    isOutsideOfNoticePeriod(courseData)
  ) {
    exceptions.push(CourseException.OUTSIDE_NOTICE_PERIOD)
  }

  if (
    !ignoreExceptions.includes(CourseException.LEAD_TRAINER_IN_GRACE_PERIOD) &&
    isLeadTrainerInGracePeriod(courseData, trainerData)
  ) {
    exceptions.push(CourseException.LEAD_TRAINER_IN_GRACE_PERIOD)
  }

  if (
    !ignoreExceptions.includes(CourseException.TRAINER_RATIO_NOT_MET) &&
    isTrainersRatioNotMet(
      {
        level: courseData.courseLevel as Course_Level_Enum,
        reaccreditation: courseData.reaccreditation,
        conversion: courseData.conversion,
        accreditedBy: courseData.accreditedBy,
        max_participants: courseData.maxParticipants,
        type: courseData.type,
        deliveryType: courseData.deliveryType,
        bildStrategies: courseData.bildStrategies,
        hasSeniorOrPrincipalLeader: courseData.hasSeniorOrPrincipalLeader,
        usesAOL: courseData.usesAOL,
        isTrainer: courseData.isTrainer,
      },
      trainerData.map(t => ({
        type: t.type as CourseTrainerType,
        trainer_role_types: t.trainer_role_types,
      }))
    )
  ) {
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
  type: Course_Type_Enum
) {
  if (type === Course_Type_Enum.Open) return false
  if (type === Course_Type_Enum.Closed) return true
  return !acl.isTTAdmin()
}
