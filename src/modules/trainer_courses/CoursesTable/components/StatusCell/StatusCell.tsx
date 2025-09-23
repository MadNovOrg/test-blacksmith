import { TableCell } from '@mui/material'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { IndividualCourseStatusChip } from '@app/components/IndividualCourseStatus'
import { useAuth } from '@app/context/auth'
import { TableCourse } from '@app/modules/trainer_courses/utils'
import { AdminOnlyCourseStatus } from '@app/types'

export function StatusCell({ course }: { course: TableCourse }) {
  const { acl } = useAuth()

  return (
    <TableCell>
      {course.status ? (
        acl.isOrgAdmin() ? (
          <IndividualCourseStatusChip
            course={course}
            participants={course.courseParticipants ?? []}
          />
        ) : (
          <CourseStatusChip
            status={
              course.cancellationRequest
                ? AdminOnlyCourseStatus.CancellationRequested
                : course.status
            }
          />
        )
      ) : null}
    </TableCell>
  )
}
