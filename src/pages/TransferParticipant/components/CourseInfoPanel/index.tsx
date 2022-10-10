import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { InfoPanel } from '@app/components/InfoPanel'
import { Course, Course_Schedule, Venue } from '@app/generated/graphql'
import theme from '@app/theme'

type Props = {
  course: {
    level: Course['level']
    startDate: Course_Schedule['start']
    endDate: Course_Schedule['end']
    venue?: Pick<
      Venue,
      'name' | 'addressLineOne' | 'addressLineTwo' | 'city' | 'postCode'
    > | null
  }
}

export const CourseInfoPanel: React.FC<Props> = ({ course }) => {
  const { t } = useTranslation()

  return (
    <InfoPanel title={t(`course-levels.${course.level}`)}>
      <Typography color={theme.palette.dimGrey.main} mb={1}>
        {`${t('dates.longWithTime', {
          date: course.startDate,
        })} - ${t('dates.longWithTime', {
          date: course.endDate,
        })}`}
      </Typography>

      {course.venue ? (
        <Typography color={theme.palette.dimGrey.main}>
          {[
            course.venue.name,
            course.venue.addressLineOne,
            course.venue.addressLineTwo,
            course.venue.postCode,
            course.venue.city,
          ]
            .filter(Boolean)
            .join(', ')}
        </Typography>
      ) : null}
    </InfoPanel>
  )
}
