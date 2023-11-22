import { matches } from 'lodash'
import { cond, constant, stubTrue } from 'lodash-es'

import { Course_Status_Enum } from '@app/generated/graphql'
import {
  AdminOnlyCourseStatus,
  AllCourseStatuses,
  AllCourseStatuses as Statuses,
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

  if (courseEnded && !graded) {
    return AttendeeOnlyCourseStatus.AwaitingGrade
  }

  if (courseEnded && !evaluated) {
    return Course_Status_Enum.EvaluationMissing
  }

  if (courseEnded && !attended) {
    return AttendeeOnlyCourseStatus.NotAttended
  }

  if (courseEnded && graded) {
    return Course_Status_Enum.Completed
  }

  return Course_Status_Enum.Scheduled
}

const condIndividualCourseStatuses = cond<
  { ended?: boolean; graded?: boolean; cancellationRequested?: boolean },
  Statuses
>([
  [
    matches({
      cancellationRequested: true,
    }),
    constant(AdminOnlyCourseStatus.CancellationRequested),
  ],
  [
    matches({
      ended: true,
      graded: false,
      cancellationRequested: false,
    }),
    constant(AttendeeOnlyCourseStatus.AwaitingGrade),
  ],
  [
    matches({
      ended: true,
      graded: true,
      cancellationRequested: false,
    }),
    constant(Course_Status_Enum.Completed),
  ],

  [stubTrue, constant(Course_Status_Enum.Scheduled)],
])

export const getIndividualCourseStatuses = (
  status: Course_Status_Enum,
  ended: boolean,
  graded: boolean,
  cancellationRequested: boolean
) => {
  if (
    [Course_Status_Enum.Cancelled, Course_Status_Enum.Declined].includes(status)
  )
    return Course_Status_Enum.Cancelled

  if (status === Course_Status_Enum.EvaluationMissing)
    return Course_Status_Enum.Completed

  return condIndividualCourseStatuses({ ended, graded, cancellationRequested })
}
