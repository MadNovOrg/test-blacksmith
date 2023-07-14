import { Typography } from '@mui/material'
import React from 'react'

import { CourseTitleAndDuration } from '@app/components/CourseTitleAndDuration'
import { InfoPanel } from '@app/components/InfoPanel'
import { Course_Schedule, CourseLevel } from '@app/generated/graphql'
import theme from '@app/theme'

export type CourseInfoPanelProps = {
  course: {
    id: number
    courseCode: string
    level?: CourseLevel | null
    startDate: Course_Schedule['start']
    endDate: Course_Schedule['end']
    venue?: string
  }
}

export const CourseInfoPanel: React.FC<
  React.PropsWithChildren<CourseInfoPanelProps>
> = ({ course }) => (
  <InfoPanel>
    <CourseTitleAndDuration
      course={{
        id: course.id,
        course_code: course.courseCode,
        level: course.level,
      }}
    />

    {course.venue ? (
      <Typography mt={1} color={theme.palette.dimGrey.main}>
        {course.venue}
      </Typography>
    ) : null}
  </InfoPanel>
)
