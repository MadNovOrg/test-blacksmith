import { Typography, Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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

type LocationState = { from: { pathname: string; search: string } }

const bookingState = { pathname: '/booking' }

export const RegistrationPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { login, profile } = useAuth()
  const fetcher = useFetcher()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const courseId = searchParams.get('course_id')
  const quantity = searchParams.get('quantity')
  const success = searchParams.get('success') === 'true'
  const internalBooking = searchParams.get('internal') === 'true'
  const locationState = (location.state || {}) as LocationState
  const from = courseId ? bookingState : locationState.from

  const onSignUp = async (email: string, password: string) => {
    navigate('?success=true', { replace: true, state: { from } })
    await login(email, password)
  }

  // when login completes, we have an active profile of unverified user,
  // router sets in the available routes and we navigate to verify
  useEffect(() => {
    if (!profile) return
    navigate('/verify', { replace: true, state: { from } })
  }, [profile, navigate, from])

  // This page loads for logged in as well as logged out users. When it loads
  // for logged in user, it will have a profile for sure, in which case we need to
  // return early instead of showing registration form and just capture booking
  // details for the booking page
  useMount(async () => {
    // Purpose of success flag:
    // After the sign up, we try to auto-login and redirect the user to /verify page.
    // However, as soon as the login happens and `profile` in auth context gets
    // populated, react-router renders new routes that are relevant for logged in users,
    // which re-mounts this same components because our address is still /registration
    // Hence, before auto-login, we replace the /registration with /registraion?success=true
    // and check the same here and skip the further steps
    if (success) return

    if (!profile || !courseId || !quantity) return

    const input = {
      givenName: profile.givenName,
      familyName: profile.familyName,
      acceptMarketing: true,
      acceptTnc: true,
      courseId: +courseId,
      quantity: +quantity,
      dob: null,
    }

    await fetcher<ResponseType, ParamsType>(MUTATION, { input })

    navigate(`/booking/details`, {
      replace: true,
      state: { internalBooking },
    })
  })

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
            state={{ from }}
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
