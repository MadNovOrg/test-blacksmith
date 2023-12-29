import { Box, Typography, TypographyProps } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { getTimeDifferenceAndContext } from '@app/util'

type Props = {
  start: Date
  end: Date
  courseResidingCountry?: string | null
} & TypographyProps

export const CourseDuration: React.FC<React.PropsWithChildren<Props>> = ({
  start,
  end,
  courseResidingCountry,
  ...props
}) => {
  const { t } = useTranslation()
  const { isUKCountry } = useWorldCountries()

  const difference = getTimeDifferenceAndContext(end, start)

  return (
    <Box data-testid="order-course-duration">
      {difference.context === 'hours' ? (
        <>
          <Typography color="grey.700" mb={1} {...props}>
            {t('dates.defaultShort', { date: start })}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography color="grey.700" {...props}>
              {t('dates.timeFromTo', { from: start, to: end })}
            </Typography>
            {!isUKCountry(courseResidingCountry) && (
              <Typography marginLeft={1}>(local time)</Typography>
            )}
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <Typography color="grey.700" {...props}>
            {t('dates.dateTimeFromTo', { from: start, to: end })}
          </Typography>
          {!isUKCountry(courseResidingCountry) && (
            <Typography marginLeft={1}>(local time)</Typography>
          )}
        </Box>
      )}
    </Box>
  )
}
