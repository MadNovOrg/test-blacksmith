import { Course_Status_Enum } from '@app/generated/graphql'
import {
  AdminOnlyCourseStatus,
  AllCourseStatuses,
  AttendeeOnlyCourseStatus,
} from '@app/types'

export function getAttendeeCourseStatus({
  courseEnded,
  evaluated,
  providedInfo,
  graded,
  attended,
  courseStatus,
}: {
  courseEnded: boolean
  evaluated: boolean
  attended: boolean
  providedInfo: boolean
  graded: boolean
  courseStatus?: Course_Status_Enum | null | AdminOnlyCourseStatus
}): AllCourseStatuses {
  if (courseStatus === Course_Status_Enum.Cancelled) {
    return Course_Status_Enum.Cancelled
  }

  if (!courseEnded && !providedInfo) {
    return AttendeeOnlyCourseStatus.InfoRequired
  }

  if (courseEnded && !attended) {
    return AttendeeOnlyCourseStatus.NotAttended
  }

  if (courseEnded && !evaluated) {
    return Course_Status_Enum.EvaluationMissing
  }

  if (courseEnded && evaluated && !graded) {
    return Course_Status_Enum.GradeMissing
  }

  if (courseEnded && graded) {
    return Course_Status_Enum.Completed
  }

  return Course_Status_Enum.Scheduled
}
