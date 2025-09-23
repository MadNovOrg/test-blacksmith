import { useLocation } from 'react-router-dom'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { IndividualCourseStatusChip } from '@app/components/IndividualCourseStatus'
import { useAuth } from '@app/context/auth'
import {
  AttendeeCourse,
  AttendeeCourseStatus,
} from '@app/modules/course_details/course_attendees_tab/components/AttendeeCourseStatus/AttendeeCourseStatus'
import { AdminOnlyCourseStatus, Course } from '@app/types'
import { UKTimezone } from '@app/util'

export const CourseHeroStatusChip: React.FC<{
  isManaged: boolean
  course: Course
}> = ({ isManaged, course }) => {
  const location = useLocation()
  const isMyCourses = location.pathname.includes('/courses/')

  const { acl } = useAuth()

  if (isMyCourses && acl.isUser()) {
    return <AttendeeCourseStatus course={course as unknown as AttendeeCourse} />
  }

  if (isManaged) {
    return (
      <IndividualCourseStatusChip
        course={{
          ...course,
          schedule: [
            {
              ...course.schedule[0],
              timeZone: course.schedule[0].timeZone ?? UKTimezone,
            },
          ],
        }}
        participants={course.courseParticipants ?? []}
      />
    )
  }

  return (
    <CourseStatusChip
      status={
        course.cancellationRequest
          ? AdminOnlyCourseStatus.CancellationRequested
          : course.status
      }
    />
  )
}
