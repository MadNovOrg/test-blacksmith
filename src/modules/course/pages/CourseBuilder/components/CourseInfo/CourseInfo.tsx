import { Box, BoxProps, Typography } from '@mui/material'
import { utcToZonedTime } from 'date-fns-tz'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseInfoFragment } from '@app/generated/graphql'
import useTimeZones from '@app/hooks/useTimeZones'

type CourseInfoProps = {
  data: CourseInfoFragment
} & BoxProps

export const CourseInfo: React.FC<React.PropsWithChildren<CourseInfoProps>> = ({
  data,
  ...props
}) => {
  const { t } = useTranslation()
  const { formatGMTDateTimeByTimeZone } = useTimeZones()
  const residingCountryEnabled = useFeatureFlagEnabled(
    'course-residing-country'
  )

  const isResidingCountryEnabled = useMemo(
    () => residingCountryEnabled,
    [residingCountryEnabled]
  )

  const timeZoneScheduleDateTime = useMemo(() => {
    const timeZone = data.schedule[0].timeZone ?? 'Europe/London'

    return {
      start: utcToZonedTime(data.start, timeZone),
      end: utcToZonedTime(data.end, timeZone),
    }
  }, [data.end, data.schedule, data.start])

  let location = ''
  if (data.schedule && data.schedule.length > 0) {
    if (data.schedule[0].venue) {
      const venue = data.schedule[0].venue
      location = [venue.name, venue.city].join(', ')
    }
  }

  return (
    <Box
      {...props}
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
        <Box data-testid="course-organization">
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
        <Box data-testid="course-location">
          <Typography display="inline" variant="body2" fontWeight={600}>
            {`${t('pages.trainer-base.create-course.new-course.location')}: `}
          </Typography>
          <Typography display="inline" variant="body2">
            {location}
          </Typography>
        </Box>
      )}

      <Box data-testid="course-start-date">
        <Typography display="inline" variant="body2" fontWeight={600}>
          {`${t('pages.trainer-base.create-course.new-course.starts')}: `}
        </Typography>
        <Typography display="inline" variant="body2">
          {`${t('dates.withTime', {
            date: isResidingCountryEnabled
              ? timeZoneScheduleDateTime.start
              : data.start,
          })}${
            isResidingCountryEnabled
              ? ` ${formatGMTDateTimeByTimeZone(
                  timeZoneScheduleDateTime.start,
                  data.schedule[0].timeZone
                )}`
              : ''
          }`}
        </Typography>
      </Box>
      <Box data-testid="course-end-date">
        <Typography display="inline" variant="body2" fontWeight={600}>
          {`${t('pages.trainer-base.create-course.new-course.ends')}: `}
        </Typography>
        <Typography display="inline" variant="body2">
          {`${t('dates.withTime', {
            date: isResidingCountryEnabled
              ? timeZoneScheduleDateTime.end
              : data.end,
          })}${
            isResidingCountryEnabled
              ? ` ${formatGMTDateTimeByTimeZone(
                  timeZoneScheduleDateTime.end,
                  data.schedule[0].timeZone
                )}`
              : ''
          }`}
        </Typography>
      </Box>
      <Box data-testid="course-type">
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
