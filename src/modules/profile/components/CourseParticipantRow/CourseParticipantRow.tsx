import { Link, TableCell, TableRow } from '@mui/material'
import { format } from 'date-fns'
import { matches } from 'lodash'
import { cond, constant, stubTrue } from 'lodash-es'
import { useMemo } from 'react'

import { Course_Status_Enum as CourseStatus } from '@app/generated/graphql'

import { PROFILE_TABLE_ROW_SX } from '../../utils/common'

interface Props {
  isInternalUser?: boolean
  courseInfo: {
    courseId: number
    courseName: string
    courseStatus?: CourseStatus
    attended?: boolean
    courseStartDate?: string
  }
}

export const CourseParticipantRow = ({
  isInternalUser = false,
  courseInfo,
}: Props) => {
  const { courseId, courseName, attended, courseStatus, courseStartDate } =
    courseInfo

  const shouldShowTheRow = useMemo(() => {
    if (!courseStatus) return false

    const conditionsToShowTheRow = [
      CourseStatus.Cancelled,
      CourseStatus.Completed,
      CourseStatus.ConfirmModules,
      CourseStatus.Declined,
      CourseStatus.EvaluationMissing,
      CourseStatus.ExceptionsApprovalPending,
      CourseStatus.GradeMissing,
      CourseStatus.Scheduled,
      CourseStatus.TrainerDeclined,
      CourseStatus.TrainerMissing,
      CourseStatus.TrainerPending,
    ]

    return conditionsToShowTheRow.includes(courseStatus)
  }, [courseStatus])

  const attendeeAction = useMemo(() => {
    if (!courseStartDate || !courseStatus) return null

    const mapCourseToAttendeeAction = cond([
      [
        matches({ active: false, isInternal: false }),
        constant({ label: 'Cancelled', showLink: false }),
      ],
      [
        matches({ active: false, isInternal: true }),
        constant({ label: 'Cancelled', showLink: true }),
      ],
      [
        matches({ active: true, attended: false }),
        constant({ label: 'Not Attended', showLink: true }),
      ],
      [
        matches({ active: true, attended: null }),
        constant({ label: 'Attending', showLink: true }),
      ],
      [
        matches({ active: true, attended: true }),
        constant({ label: 'Attended', showLink: true }),
      ],
      [
        matches({ active: true, attended: undefined }),
        constant({ label: 'Attending', showLink: true }),
      ],
      [stubTrue, constant(null)],
    ])

    const active = ![CourseStatus.Cancelled, CourseStatus.Declined].includes(
      courseStatus
    )

    return {
      course: mapCourseToAttendeeAction({
        active,
        attended,
        isInternal: isInternalUser,
      }),
      startDate: active
        ? format(new Date(courseStartDate), 'd MMM yyyy')
        : null,
    }
  }, [attended, courseStartDate, courseStatus, isInternalUser])

  if (!shouldShowTheRow || !attendeeAction) return null

  return (
    <TableRow sx={PROFILE_TABLE_ROW_SX} data-testid={`course-row-${courseId}`}>
      <TableCell data-testid="course-name">
        {attendeeAction.course?.showLink ? (
          <Link href={`/courses/${courseId}/details`}>{courseName}</Link>
        ) : (
          courseName
        )}
      </TableCell>
      <TableCell data-testid="course-action">
        {attendeeAction.course?.label}
      </TableCell>
      <TableCell>{attendeeAction.startDate}</TableCell>
    </TableRow>
  )
}
