import { useCallback } from 'react'

import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { Course, CourseParticipant } from '@app/types'
import { getParticipantOrgIds } from '@app/util'

export const useCanViewRowActions = (course: Course) => {
  const {
    acl: { canManageParticipantAttendance },
  } = useAuth()

  return useCallback(
    (participant: CourseParticipant) =>
      [
        !participant.profile.archived,
        canManageParticipantAttendance(
          getParticipantOrgIds(participant),
          course,
        ),
      ].every(Boolean),
    [canManageParticipantAttendance, course],
  )
}

export const useCanToggleParticipantAttendance = (
  canToggleAttendance: boolean,
  isAttendanceDisabled: boolean,
) => {
  return useCallback(
    ({ completed, grade, course: { type } }: CourseParticipant) =>
      (type === Course_Type_Enum.Indirect ? !completed : true) &&
      canToggleAttendance &&
      !isAttendanceDisabled &&
      !grade,
    [canToggleAttendance, isAttendanceDisabled],
  )
}
