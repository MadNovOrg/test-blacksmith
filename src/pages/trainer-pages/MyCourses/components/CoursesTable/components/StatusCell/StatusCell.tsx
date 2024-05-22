import { TableCell } from '@mui/material'

import { CourseStatusChip } from '@app/components/CourseStatusChip'
import { IndividualCourseStatusChip } from '@app/components/IndividualCourseStatus'
import { useAuth } from '@app/context/auth'
import { AdminOnlyCourseStatus } from '@app/types'

import { TableCourse } from '../../types'

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
