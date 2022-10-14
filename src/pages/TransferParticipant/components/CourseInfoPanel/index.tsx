import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { InfoPanel } from '@app/components/InfoPanel'
import { Course_Schedule } from '@app/generated/graphql'
import theme from '@app/theme'

type Props = {
  course: {
    courseCode: string
    startDate: Course_Schedule['start']
    endDate: Course_Schedule['end']
    venue?: string
  }
}

export const CourseInfoPanel: React.FC<Props> = ({ course }) => {
  const { t } = useTranslation()

  return (
    <InfoPanel title={course.courseCode}>
      <Typography color={theme.palette.dimGrey.main} mb={1}>
        {`${t('dates.longWithTime', {
          date: course.startDate,
        })} - ${t('dates.longWithTime', {
          date: course.endDate,
        })}`}
      </Typography>

      {course.venue ? (
        <Typography color={theme.palette.dimGrey.main}>
          {course.venue}
        </Typography>
      ) : null}
    </InfoPanel>
  )
}
