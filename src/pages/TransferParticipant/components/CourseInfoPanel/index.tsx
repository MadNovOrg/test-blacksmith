import { Typography } from '@mui/material'
import React from 'react'

import { InfoPanel } from '@app/components/InfoPanel'
import {
  Course_Schedule,
  Course_Level_Enum,
  CourseLevel,
} from '@app/generated/graphql'
import { CourseTitleAndDuration } from '@app/modules/course_details/components/CourseTitleAndDuration'
import theme from '@app/theme'

export type CourseInfoPanelProps = {
  course: {
    id: number
    courseCode: string
    level?: Course_Level_Enum | CourseLevel | null
    priceCurrency?: string
    startDate: Course_Schedule['start']
    endDate: Course_Schedule['end']
    venue?: string
    reaccreditation?: boolean
    timezone?: string
    residingCountry?: string
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
        timeZone: course.timezone,
        residingCountry: course.residingCountry,
      }}
    />

    {course.venue ? (
      <Typography mt={1} color={theme.palette.dimGrey.main}>
        {course.venue}
      </Typography>
    ) : null}
  </InfoPanel>
)
