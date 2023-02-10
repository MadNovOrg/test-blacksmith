import { Link, Typography, TypographyProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Course, CourseLevel } from '@app/generated/graphql'
import { getTimeDifferenceAndContext } from '@app/util'

export type CourseSubset = Pick<
  Course,
  'id' | 'course_code' | 'start' | 'end'
> & {
  level?: CourseLevel | null
}

type CourseTitleProps = {
  course: CourseSubset
  showCourseLink?: boolean
} & TypographyProps

export const CourseTitle: React.FC<CourseTitleProps> = ({
  course,
  showCourseLink = false,
  ...props
}) => {
  const { t } = useTranslation()

  const difference = getTimeDifferenceAndContext(
    new Date(course.end),
    new Date(course.start)
  )

  return (
    <Typography
      {...props}
      variant="h6"
      fontWeight={600}
      data-testid="order-course-title"
    >
      {t(`course-levels.${course?.level}`)}{' '}
      {difference.context === 'hours'
        ? ` - ${difference.count} ${t('hours')} `
        : ''}
      {course?.course_code ? (
        showCourseLink ? (
          <Link href={`/courses/${course.id}/details`} color="primary">
            ({course.course_code})
          </Link>
        ) : (
          <>({course.course_code})</>
        )
      ) : null}
    </Typography>
  )
}
