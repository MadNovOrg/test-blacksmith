import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { IndividualCourseStatusChip } from '@app/components/IndividualCourseStatus'
import {
  AttendeeCourseStatus,
  AttendeeCourse,
} from '@app/modules/course_attendees/components/AttendeeCourseStatus/AttendeeCourseStatus'
import { AdminOnlyCourseStatus, Course } from '@app/types'
import { UKTimezone } from '@app/util'

export const CourseHeroStatusChip: React.FC<{
  isManaged: boolean
  course: Course
}> = ({ isManaged, course }) => {
  const isCourseManaged = () => {
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

    return <AttendeeCourseStatus course={course as unknown as AttendeeCourse} />
  }
  if (course.status) {
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
  return isCourseManaged()
}
