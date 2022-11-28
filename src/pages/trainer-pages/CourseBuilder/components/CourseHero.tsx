import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { GetCourseByIdQuery } from '@app/generated/graphql'

type CourseHeroProps = {
  data: NonNullable<GetCourseByIdQuery['course']>
}

export const CourseHero: React.FC<CourseHeroProps> = ({ data }) => {
  const { t } = useTranslation()

  let location = ''
  if (data.schedule && data.schedule.length > 0) {
    if (data.schedule[0].venue) {
      const venue = data.schedule[0].venue
      location = [venue.name, venue.city].join(', ')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: {
          xs: 'left',
          md: 'right',
        },
      }}
    >
      {data.organization && (
        <Box>
          <Typography display="inline" variant="body2" fontWeight={600}>
            {`${t(
              'pages.trainer-base.create-course.new-course.organization'
            )}: `}
          </Typography>
          <Typography display="inline" variant="body2">
            {data.organization.name}
          </Typography>
        </Box>
      )}
      {location && (
        <Box>
          <Typography display="inline" variant="body2" fontWeight={600}>
            {`${t('pages.trainer-base.create-course.new-course.location')}: `}
          </Typography>
          <Typography display="inline" variant="body2">
            {location}
          </Typography>
        </Box>
      )}

      <Box>
        <Typography display="inline" variant="body2" fontWeight={600}>
          {`${t('pages.trainer-base.create-course.new-course.starts')}: `}
        </Typography>
        <Typography display="inline" variant="body2">
          {t('dates.withTime', { date: data.schedule?.[0]?.start })}
        </Typography>
      </Box>
      <Box>
        <Typography display="inline" variant="body2" fontWeight={600}>
          {`${t('pages.trainer-base.create-course.new-course.ends')}: `}
        </Typography>
        <Typography display="inline" variant="body2">
          {t('dates.withTime', {
            date: data.schedule?.[data.schedule?.length - 1]?.end,
          })}
        </Typography>
      </Box>
      <Box>
        <Typography display="inline" variant="body2" fontWeight={600}>
          {`${t('pages.trainer-base.create-course.new-course.course-type')}: `}
        </Typography>
        <Typography display="inline" variant="body2">
          {data.deliveryType && t(`course-delivery-type.${data.deliveryType}`)}
          {data.go1Integration ? ` (${t('common.blended-learning')})` : ''}
        </Typography>
      </Box>
    </Box>
  )
}
