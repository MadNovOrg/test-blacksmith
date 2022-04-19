import { Typography, Box, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { LinkBehavior } from '@app/components/LinkBehavior'

import { Form } from './components/Form'

export const CourseBookingPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const courseId = searchParams.get('course_id')

  if (!courseId) {
    return <div>No course id</div>
  }

  return (
    <AppLayoutMinimal width={628}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h3" fontWeight="600" color="secondary" mb={1}>
          {t('create-free-account')}
        </Typography>
        <Typography
          variant="body1"
          color="grey.700"
          alignItems="center"
          display="flex"
        >
          {t('have-account')}
          <Button
            component={LinkBehavior}
            href="/login"
            variant="text"
            color="primary"
            size="small"
          >
            {t('login')}
          </Button>
        </Typography>
      </Box>

      <Form />
    </AppLayoutMinimal>
  )
}
