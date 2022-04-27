import { Typography, Box, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { useAuth } from '@app/context/auth'

import { Form } from './components/Form'

export const CourseRegistrationPage: React.FC = () => {
  const { login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const courseId = searchParams.get('course_id')
  const quantity = searchParams.get('quantity')

  const onSignUp = (email: string, password: string) => {
    // delay auto-login just in case
    setTimeout(async () => {
      await login(email, password)
      // when login completes, we have an active profile of unverified user,
      // router sets in the available routes and we navigate to verify
      navigate('/verify', { replace: true })
    }, 500)
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

      <Form
        onSignUp={onSignUp}
        courseId={courseId ? +courseId : null}
        quantity={quantity ? +quantity : null}
      />
    </AppLayoutMinimal>
  )
}
