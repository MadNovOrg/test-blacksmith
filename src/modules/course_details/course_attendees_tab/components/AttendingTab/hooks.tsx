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
    ({
      completed,
      grade,
      course: { go1Integration, resourcePacksType, type },
    }: CourseParticipant) => {
      const isIndirectWithIntegration =
        type === Course_Type_Enum.Indirect &&
        (go1Integration || Boolean(resourcePacksType))

      const canToggle =
        (!isIndirectWithIntegration || !completed) &&
        canToggleAttendance &&
        !isAttendanceDisabled &&
        !grade

      return canToggle
    },
    [canToggleAttendance, isAttendanceDisabled],
  )
}
