import { Box } from '@mui/material'
import { TypographyProps } from '@mui/material'
import React from 'react'

import { CourseDuration } from './components/CourseDuration'
import { CourseTitle, CourseSubset } from './components/CourseTitle'

export type CourseTitleAndDurationProps = {
  course: CourseSubset
  showCourseLink?: boolean
  showCourseDuration?: boolean
} & TypographyProps

export const CourseTitleAndDuration: React.FC<
  React.PropsWithChildren<CourseTitleAndDurationProps>
> = ({ course, showCourseLink, showCourseDuration, ...props }) => {
  return (
    <Box {...props}>
      <CourseTitle
        course={course}
        showCourseLink={showCourseLink}
        showCourseDuration={showCourseDuration}
        mb={1}
      />
      {course?.start && course?.end && (
        <CourseDuration
          start={new Date(course?.start)}
          end={new Date(course?.end)}
        />
      )}
    </Box>
  )
}
