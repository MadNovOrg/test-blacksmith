import { Box, Typography, TypographyProps } from '@mui/material'
import { utcToZonedTime } from 'date-fns-tz'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import useTimeZones from '@app/hooks/useTimeZones'

type Props = {
  start: Date
  end: Date
  courseResidingCountry?: string | null
  timeZone?: string
} & TypographyProps

export const CourseDuration: React.FC<React.PropsWithChildren<Props>> = ({
  start,
  end,
  courseResidingCountry,
  timeZone,
  ...props
}) => {
  const residingCountryEnabled = useFeatureFlagEnabled(
    'course-residing-country',
  )

  const { t } = useTranslation()
  const { formatGMTDateTimeByTimeZone } = useTimeZones()
  const { isUKCountry } = useWorldCountries()
  const isResidingCountryEnabled = useMemo(
    () => residingCountryEnabled,
    [residingCountryEnabled],
  )

  const timeZoneScheduleDateTime = useMemo(() => {
    if (!timeZone) return { start, end }

    return {
      start: utcToZonedTime(start, timeZone),
      end: utcToZonedTime(end, timeZone),
    }
  }, [end, start, timeZone])
  return (
    <Box data-testid="order-course-duration">
      <>
        <Typography color="grey.700" mb={1} {...props}>
          {t('dates.defaultShort', { date: start })}
        </Typography>
        {isResidingCountryEnabled && Boolean(timeZone) ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography color="grey.700" {...props}>
              {`${t('pages.course-participants.course-beggins')} ${t(
                'dates.time',
                {
                  date: timeZoneScheduleDateTime.start,
                },
              )} ${formatGMTDateTimeByTimeZone(
                timeZoneScheduleDateTime.start,
                timeZone,
                true,
              )}`}
            </Typography>
            <Typography color="grey.700" {...props}>
              {`${t('pages.course-participants.course-ends')} ${t(
                'dates.time',
                {
                  date: timeZoneScheduleDateTime.end,
                },
              )} ${formatGMTDateTimeByTimeZone(
                timeZoneScheduleDateTime.end,
                timeZone,
                true,
              )}`}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <Typography color="grey.700" {...props}>
              {t('dates.timeFromTo', { from: start, to: end })}
            </Typography>
            {!isUKCountry(courseResidingCountry) && (
              <Typography marginLeft={1}>(local time)</Typography>
            )}
          </Box>
        )}
      </>
    </Box>
  )
}
