import { Typography, Box, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMount } from 'react-use'

import { AppLayoutMinimal } from '@app/components/AppLayoutMinimal'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION,
  ResponseType,
  ParamsType,
} from '@app/queries/profile/insert-profile-temp'

import { Form } from './components/Form'

export const CourseRegistrationPage: React.FC = () => {
  const { login, profile } = useAuth()
  const fetcher = useFetcher()
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

  useMount(async () => {
    if (!profile || !courseId || !quantity) return

    const input = {
      givenName: profile.givenName,
      familyName: profile.familyName,
      acceptMarketing: true,
      acceptTnc: true,
      courseId: +courseId,
      quantity: +quantity,
    }

    await fetcher<ResponseType, ParamsType>(MUTATION, { input })

    navigate('/booking', { replace: true })
  })

  // This page loads for authed as well as unauthed users
  // When it loads for authed, it sure has a profile, in which case
  // We gotta return early instead of showing registration form
  // and just capture booking details for the booking page
  if (profile) return <SuspenseLoading />

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
