import { Alert, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const CourseBookingDone: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Stack flex={1} alignItems="center" textAlign="center">
        <Alert variant="outlined" color="success" sx={{ mb: 4 }}>
          {t('pages.book-course.order-success-info')}
        </Alert>

        <Typography variant="subtitle1">
          {t('pages.book-course.order-success-msg')}
        </Typography>
      </Stack>
    </Box>
  )
}
