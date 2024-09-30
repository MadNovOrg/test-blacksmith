import { TableCell, Typography, Link } from '@mui/material'

import { useAuth } from '@app/context/auth'
import { Course_Invite_Status_Enum } from '@app/generated/graphql'
import { TableCourse } from '@app/modules/trainer_courses/utils'
import { RoleName } from '@app/types'
import { findCourseTrainer } from '@app/util'

import { CourseTitle } from '../CourseTitle'

export function CourseTitleCell({ course }: { course: TableCourse }) {
  const { profile, acl, activeRole } = useAuth()

  const courseTrainer =
    profile && activeRole === RoleName.TRAINER
      ? findCourseTrainer(course?.trainers, profile.id)
      : undefined

  const courseHasModules =
    (course.modulesAgg.aggregate?.count &&
      course.modulesAgg.aggregate?.count > 0) ||
    course.bildModules.length ||
    course.curriculum?.length

  const titleLink =
    (course.isDraft || !courseHasModules) && acl.canBuildCourse()
      ? `${course.id}/modules`
      : `${course.id}/details`

  return (
    <TableCell data-testid="course-name-cell">
      {courseTrainer &&
      courseTrainer.status === Course_Invite_Status_Enum.Pending ? (
        <CourseTitle code={course.course_code} name={course.name} />
      ) : (
        <Link href={titleLink}>
          <CourseTitle code={course.course_code} name={course.name} />
        </Link>
      )}
      {/* TODO: Delete this after Arlo migration */}
      {course.arloReferenceId && acl.isInternalUser() ? (
        <>
          <Typography variant="body2" data-testid="arlo-reference-label">
            {`${acl.isUK() ? 'Arlo' : 'Internal'} reference:`}
          </Typography>
          <Typography
            variant="body2"
            data-testid="arlo-reference-id"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '150px',
            }}
          >
            {course.arloReferenceId}
          </Typography>
        </>
      ) : null}
    </TableCell>
  )
}
