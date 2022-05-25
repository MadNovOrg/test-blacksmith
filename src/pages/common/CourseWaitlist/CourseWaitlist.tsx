import { Alert, Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { LinkBehavior } from '@app/components/LinkBehavior'

import { Form } from './components/Form'

export const CourseWaitlist: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  const courseId = searchParams.get('course_id')

  if (email) {
    return (
      <AppLayoutMinimal width={628}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Alert
            variant="outlined"
            color="success"
            sx={{ mb: 3 }}
            data-testid="success-alert"
          >
            {t('waitlist-added')}
          </Alert>

          <Typography
            variant="subtitle1"
            fontWeight="500"
            mb={2}
            textAlign="center"
          >
            {t('confirmation-email-sent', { email })}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            component={LinkBehavior}
            href="/"
          >
            {t('goto-tt')}
          </Button>
        </Box>
      </AppLayoutMinimal>
    )
  }

  return (
    <AppLayoutMinimal width={628}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          {t('join-waitlist-title')}
        </Typography>
        <Typography variant="body1" textAlign="center" color="grey.700">
          {t('join-waitlist-notice')}
        </Typography>
      </Box>

      {courseId ? <Form onSuccess={setEmail} courseId={+courseId} /> : null}
    </AppLayoutMinimal>
  )
}
