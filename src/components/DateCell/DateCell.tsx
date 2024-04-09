import { TableCell, Box, Typography } from '@mui/material'
import { utcToZonedTime } from 'date-fns-tz'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useTimeZones from '@app/hooks/useTimeZones'

export function DateCell({
  date,
  timeZone,
}: {
  date: Date
  timeZone?: string
}) {
  const residingCountryEnabled = useFeatureFlagEnabled(
    'course-residing-country'
  )
  const isResidingCountryEnabled = !!residingCountryEnabled
  const { t } = useTranslation()
  const { formatGMTDateTimeByTimeZone } = useTimeZones()

  const UTCDate = useMemo(
    () => utcToZonedTime(date, timeZone ?? 'Europe/London'),
    [date, timeZone]
  )

  return (
    <TableCell>
      {date && (
        <Box>
          <Typography variant="body2" gutterBottom>
            {t('dates.defaultShort', {
              date: isResidingCountryEnabled ? UTCDate : date,
            })}
          </Typography>
          <Typography variant="body2" whiteSpace="nowrap">
            {t('dates.time', {
              date: isResidingCountryEnabled ? UTCDate : date,
            })}
          </Typography>
          {isResidingCountryEnabled ? (
            <Typography variant="body2" whiteSpace="nowrap">
              {formatGMTDateTimeByTimeZone(UTCDate, timeZone)}
            </Typography>
          ) : null}
        </Box>
      )}
    </TableCell>
  )
}
