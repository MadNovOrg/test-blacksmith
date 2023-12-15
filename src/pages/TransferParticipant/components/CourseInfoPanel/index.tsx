import { Typography } from '@mui/material'
import React from 'react'

import { CourseTitleAndDuration } from '@app/components/CourseTitleAndDuration'
import { InfoPanel } from '@app/components/InfoPanel'
import {
  Course_Schedule,
  Course_Level_Enum,
  CourseLevel,
} from '@app/generated/graphql'
import theme from '@app/theme'

export type CourseInfoPanelProps = {
  course: {
    id: number
    courseCode: string
    level?: Course_Level_Enum | CourseLevel | null
    startDate: Course_Schedule['start']
    endDate: Course_Schedule['end']
    venue?: string
    reaccreditation?: boolean
  }
}

export const CourseInfoPanel: React.FC<
  React.PropsWithChildren<CourseInfoPanelProps>
> = ({ course }) => (
  <InfoPanel>
    <CourseTitleAndDuration
      showCourseDuration={false}
      course={{
        id: course.id,
        course_code: course.courseCode,
        level: course.level,
        start: course.startDate,
        end: course.endDate,
        reaccreditation: course.reaccreditation,
      }}
    />

    {course.venue ? (
      <Typography mt={1} color={theme.palette.dimGrey.main}>
        {course.venue}
      </Typography>
    ) : null}
  </InfoPanel>
)
