import { Link, Typography, TypographyProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Course } from '@app/generated/graphql'
import { getTimeDifferenceAndContext } from '@app/util'

type Props = {
  course: Pick<Course, 'id' | 'course_code' | 'level' | 'start' | 'end'>
} & TypographyProps

export const CourseTitle: React.FC<Props> = ({ course, ...props }) => {
  const { t } = useTranslation()

  const difference = getTimeDifferenceAndContext(
    new Date(course.end),
    new Date(course.start)
  )

  return (
    <Typography {...props} variant="h6" fontWeight={600}>
      {t(`course-levels.${course?.level}`)}{' '}
      {difference.context === 'hours'
        ? ` - ${difference.count} ${t('hours')} `
        : ''}
      {course?.course_code && (
        <Link href={`/courses/${course.id}/details`} color="primary">
          ({course?.course_code})
        </Link>
      )}
    </Typography>
  )
}
