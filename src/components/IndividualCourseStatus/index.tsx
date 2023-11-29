import { isPast } from 'date-fns'
import React, { useMemo } from 'react'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import {
  Course_Status_Enum as CourseStatuses,
  UserCoursesQuery,
} from '@app/generated/graphql'
import { getIndividualCourseStatuses } from '@app/rules/course-status'

export type CourseStatusDetails = Pick<
  UserCoursesQuery['courses'][0],
  'cancellationRequest' | 'schedule' | 'status'
>

type IndividualCourseStatusProps = {
  course: CourseStatusDetails
  participants: UserCoursesQuery['courses'][0]['courseParticipants']
}

export const IndividualCourseStatusChip: React.FC<
  React.PropsWithChildren<IndividualCourseStatusProps>
> = ({ course, participants }) => {
  const ended = isPast(new Date(course.schedule[0].end))

  const mappedStatus = useMemo(() => {
    const { status } = course

    if (status === CourseStatuses.Cancelled) return status

    return getIndividualCourseStatuses(
      status as CourseStatuses,
      ended,
      Boolean(participants.length) &&
        !participants?.some(participant => !participant.grade),
      Boolean(course.cancellationRequest)
    )
  }, [course, ended, participants])
  return <CourseStatusChip status={mappedStatus} />
}
