import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@app/theme'

type Props = {
  gradingAll: boolean
  count: number
}

export const GradingCount: React.FC<Props> = ({ gradingAll, count }) => {
  const { t } = useTranslation()

  return (
    <Typography color={theme.palette.grey[700]} fontWeight={600} mb={1}>
      {gradingAll
        ? t('pages.course-grading.attendees-list-title-all')
        : t('pages.course-grading.attendees-list-title', {
            count,
          })}
    </Typography>
  )
}
