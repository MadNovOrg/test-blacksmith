import { TableCell } from '@mui/material'
import { FC } from 'react'

import { useAuth } from '@app/context/auth'
import {
  useCanViewRowActions,
  useCanToggleParticipantAttendance,
  getAttendanceDisabled,
} from '@app/modules/course_details/course_attendees_tab/components/AttendingTab'
import { AttendingToggle } from '@app/modules/course_details/course_attendees_tab/components/AttendingToggle/AttendingToggle'
import { CourseParticipant, Course } from '@app/types'
import { courseStarted } from '@app/util'

export const ToggleAttendanceColumn: FC<{
  participant: CourseParticipant
  course: Course
}> = ({ participant, course }) => {
  const {
    acl: { canGradeParticipants, isOrgAdmin, isOrgKeyContact },
  } = useAuth()
  const canToggleAttendance =
    canGradeParticipants(course.trainers ?? []) && courseStarted(course)

  const isAttendanceDisabled = getAttendanceDisabled(course.status)

  const canToggleParticipantAttendance = useCanToggleParticipantAttendance(
    canToggleAttendance,
    isAttendanceDisabled,
  )
  const canViewRowActions = useCanViewRowActions(course)
  const isOrganisationContactPerson = isOrgAdmin() || isOrgKeyContact()
  const canViewRowActionsIfCourseStarted =
    courseStarted(course) && canViewRowActions(participant)
  if (
    !canToggleAttendance ||
    (canViewRowActionsIfCourseStarted && isOrganisationContactPerson)
  )
    return null
  return (
    <TableCell width={180}>
      <AttendingToggle
        participant={{
          ...participant,
          course_id: participant.course.id,
          profile_id: participant.profile.id,
        }}
        disabled={!canToggleParticipantAttendance(participant)}
      />
    </TableCell>
  )
}
