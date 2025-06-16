import { TableCell } from '@mui/material'
import { FC, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useCanViewRowActions,
  useManageParticipantActions,
} from '@app/modules/course_details/course_attendees_tab/components/AttendingTab'
import { ManageAttendanceMenu } from '@app/modules/course_details/course_attendees_tab/components/ManageAttendanceMenu'
import { CourseParticipant, Course } from '@app/types'

export const ActionsColumn: FC<{
  participant: CourseParticipant
  course: Course
}> = ({ participant, course }) => {
  const navigate = useNavigate()
  const { setAttendeeToCancel, setAttendeeToReplace, setAttendeeToResendInfo } =
    useManageParticipantActions()

  const handleTransferAttendee = useCallback(
    (participant: CourseParticipant) => {
      navigate(`../transfer/${participant.id}`, { replace: true })
    },
    [navigate],
  )

  const onBlendedLearningSyncClick = useCallback(
    (participant: CourseParticipant) => {
      navigate(`../blended-learning-sync/${participant.id}`, { replace: true })
    },
    [navigate],
  )

  const canViewRowActions = useCanViewRowActions(course)

  const rowActions = useMemo(
    () => ({
      onTransferClick: handleTransferAttendee,
      onReplaceClick: setAttendeeToReplace,
      onCancelClick: setAttendeeToCancel,
      onResendInformationClick: setAttendeeToResendInfo,
      onBlendedLearningSyncClick,
    }),
    [
      handleTransferAttendee,
      setAttendeeToReplace,
      setAttendeeToCancel,
      setAttendeeToResendInfo,
      onBlendedLearningSyncClick,
    ],
  )

  if (!canViewRowActions(participant)) return null
  return (
    <TableCell>
      <ManageAttendanceMenu
        course={course}
        courseParticipant={participant}
        data-testid="manage-attendance"
        {...rowActions}
      />
    </TableCell>
  )
}
