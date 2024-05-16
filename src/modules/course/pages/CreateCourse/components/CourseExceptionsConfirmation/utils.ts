import { differenceInDays, isFuture } from 'date-fns'

import { getACL } from '@app/context/auth/permissions'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  CourseLevel,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  Course_Exception_Enum,
} from '@app/generated/graphql'
import { TrainerInput } from '@app/types'
import { REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL } from '@app/util'
import {
  getRequiredAssistants,
  getRequiredLeads,
  getRequiredModerators,
  RatioCourseData,
  RatioTrainerData,
} from '@app/util/trainerRatio'

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
  isETA?: boolean
  isEmployerAOL?: boolean
}
export type TrainerData = {
  type: Course_Trainer_Type_Enum
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
  const { min: minLead } = getRequiredLeads(
    courseData.type,
    courseData.isTrainer
  )
  const { min: minModerator } = getRequiredModerators(courseData)

  const missingAssistants =
    trainers.filter(t => t.type === Course_Trainer_Type_Enum.Assistant).length <
    min

  const missingLeads =
    trainers.filter(t => t.type === Course_Trainer_Type_Enum.Leader).length <
    minLead

  const missingModerators =
    courseData.type === Course_Type_Enum.Open
      ? trainers.filter(t => t.type === Course_Trainer_Type_Enum.Moderator)
          .length < minModerator
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
  ignoreExceptions: Course_Exception_Enum[] = []
): Course_Exception_Enum[] {
  const exceptions: Course_Exception_Enum[] = []

  if (
    !ignoreExceptions.includes(Course_Exception_Enum.OutsideNoticePeriod) &&
    isOutsideOfNoticePeriod(courseData)
  ) {
    exceptions.push(Course_Exception_Enum.OutsideNoticePeriod)
  }

  if (
    !ignoreExceptions.includes(
      Course_Exception_Enum.LeadTrainerInGracePeriod
    ) &&
    isLeadTrainerInGracePeriod(courseData, trainerData)
  ) {
    exceptions.push(Course_Exception_Enum.LeadTrainerInGracePeriod)
  }

  if (
    !ignoreExceptions.includes(Course_Exception_Enum.TrainerRatioNotMet) &&
    isTrainersRatioNotMet(
      {
        level: courseData.courseLevel as Course_Level_Enum,
        reaccreditation: courseData.reaccreditation,
        accreditedBy: courseData.accreditedBy,
        max_participants: courseData.maxParticipants,
        type: courseData.type,
        deliveryType: courseData.deliveryType,
        usesAOL: courseData.usesAOL,
        isTrainer: courseData.isTrainer ?? false,
      },
      trainerData.map(t => ({
        type: t.type,
        trainer_role_types: t.trainer_role_types,
      }))
    )
  ) {
    exceptions.push(Course_Exception_Enum.TrainerRatioNotMet)
  }

  return exceptions
}

export function shouldGoIntoExceptionApproval(
  acl: ReturnType<typeof getACL>,
  type: Course_Type_Enum
) {
  return !acl.isTTAdmin() && type !== Course_Type_Enum.Open
}
