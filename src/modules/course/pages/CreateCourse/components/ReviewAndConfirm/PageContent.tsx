import { Alert, Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useCreateCourse } from '../CreateCourseProvider'
import { OrderDetailsReview } from '../OrderDetailsReview'

export const PageContent = () => {
  const { t } = useTranslation()
  const { courseData, pricing } = useCreateCourse()

  if (pricing.error) {
    return (
      <Alert severity="error" data-testid="ReviewAndConfirm-alert-pricing">
        {t('pages.create-course.review-and-confirm.pricing-fetching-error')}
      </Alert>
    )
  }

  if (!courseData) {
    return null
  }

  return (
    <Box data-testid="ReviewAndConfirm-page-content">
      <Typography variant="subtitle1" mb={2} component="h1">
        {t('pages.create-course.review-and-confirm.title')}
      </Typography>

      <OrderDetailsReview />
    </Box>
  )
}
