import { TableCell, Box, Typography } from '@mui/material'
import { utcToZonedTime } from 'date-fns-tz'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useTimeZones from '@app/hooks/useTimeZones'

export function DateCell({
  date,
  timeZone,
}: Readonly<{
  date: Date
  timeZone?: string
}>) {
  const { t } = useTranslation()
  const { formatGMTDateTimeByTimeZone } = useTimeZones()

  const UTCDate = useMemo(
    () => utcToZonedTime(date, timeZone ?? 'Europe/London'),
    [date, timeZone],
  )

  return (
    <TableCell>
      {date && (
        <Box>
          <Typography variant="body2" gutterBottom>
            {t('dates.defaultShort', {
              date: UTCDate,
            })}
          </Typography>
          <Typography variant="body2" whiteSpace="nowrap">
            {t('dates.time', {
              date: UTCDate,
            })}
          </Typography>
          <Typography variant="body2" whiteSpace="nowrap">
            {formatGMTDateTimeByTimeZone(UTCDate, timeZone)}
          </Typography>
        </Box>
      )}
    </TableCell>
  )
}
