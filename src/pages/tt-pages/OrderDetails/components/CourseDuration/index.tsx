import { Box, Typography, TypographyProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { getTimeDifferenceAndContext } from '@app/util'

type Props = {
  start: Date
  end: Date
} & TypographyProps

export const CourseDuration: React.FC<Props> = ({ start, end, ...props }) => {
  const { t } = useTranslation()

  const difference = getTimeDifferenceAndContext(end, start)

  return (
    <Box data-testid="order-course-duration">
      {difference.context === 'hours' ? (
        <>
          <Typography color="grey.700" mb={1} {...props}>
            {t('dates.defaultShort', { date: start })}
          </Typography>
          <Typography color="grey.700" {...props}>
            {t('dates.timeFromTo', { from: start, to: end })}
          </Typography>
        </>
      ) : (
        <Typography color="grey.700" {...props}>
          {t('dates.dateTimeFromTo', { from: start, to: end })}
        </Typography>
      )}
    </Box>
  )
}
