import { Link, Typography, TypographyProps } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Course, Course_Level_Enum, CourseLevel } from '@app/generated/graphql'
import { getTimeDifferenceAndContext } from '@app/util'

export type CourseSubset = Pick<
  Course,
  'id' | 'course_code' | 'reaccreditation'
> & {
  end?: Date | string
  level?: Course_Level_Enum | CourseLevel | null
  residingCountry?: string | null
  start?: Date | string
  timeZone?: string | null
}

type CourseTitleProps = {
  course: CourseSubset
  showCourseLink?: boolean
  showCourseDuration?: boolean
} & TypographyProps

export const CourseTitle: React.FC<
  React.PropsWithChildren<CourseTitleProps>
> = ({
  course,
  showCourseLink = false,
  showCourseDuration = true,
  ...props
}) => {
  const { t } = useTranslation()

  const difference =
    course.start && course.end
      ? getTimeDifferenceAndContext(
          new Date(course.end),
          new Date(course.start),
        )
      : undefined

  const courseDuration = useMemo(() => {
    if (showCourseDuration && difference) {
      return difference.context === 'hours'
        ? ` - ${difference.count} ${t('hours')} `
        : ''
    }

    return null
  }, [difference, showCourseDuration, t])

  const courseLink = useMemo(() => {
    if (course?.course_code) {
      return showCourseLink ? (
        <Link href={`/courses/${course.id}/details`} color="primary">
          ({course.course_code})
        </Link>
      ) : (
        <>({course.course_code})</>
      )
    }

    return null
  }, [course.course_code, course.id, showCourseLink])

  return (
    <Typography
      {...props}
      variant="h6"
      fontWeight={600}
      data-testid="order-course-title"
    >
      {t(`course-levels.${course?.level}`)}{' '}
      {course.reaccreditation ? t('reaccreditation') + ' ' : ''}
      {courseDuration}
      {courseLink}
    </Typography>
  )
}
