import { isPast } from 'date-fns'
import React, { useMemo } from 'react'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { UserCoursesQuery } from '@app/generated/graphql'
import { getAttendeeCourseStatus } from '@app/rules/course-status'

export type AttendeeCourse = Pick<
  NonNullable<UserCoursesQuery['courses'][0]>,
  'status' | 'evaluation_answers_aggregate' | 'schedule' | 'participants'
>

type AttendeeCourseStatusProps = {
  course: AttendeeCourse
}

export const AttendeeCourseStatus: React.FC<
  React.PropsWithChildren<AttendeeCourseStatusProps>
> = ({ course }) => {
  const status = useMemo(() => {
    const courseEnded = isPast(new Date(course.schedule[0]?.end))
    const participant = course.participants?.length
      ? course.participants?.at(0)
      : undefined
    const evaluated = Boolean(
      course.evaluation_answers_aggregate?.aggregate?.count
    )

    return getAttendeeCourseStatus({
      courseEnded,
      evaluated,
      graded: Boolean(participant?.grade),
      attended: participant?.attended ?? false,
      providedInfo: participant?.healthSafetyConsent ?? false,
      courseStatus: course.status,
    })
  }, [course])

  return <CourseStatusChip status={status} />
}
