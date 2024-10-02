import { Typography, Box, Button, useTheme, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useMount } from 'react-use'
import { useMutation } from 'urql'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { SuspenseLoading } from '@app/components/SuspenseLoading'
import { useAuth } from '@app/context/auth'
import {
  InsertProfileTempMutation,
  InsertProfileTempMutationVariables,
} from '@app/generated/graphql'
import { AppLayoutMinimal } from '@app/layouts/AppLayoutMinimal'
import { MUTATION as INSERT_PROFILE_TEMP } from '@app/modules/profile/queries/insert-profile-temp'
import { Form as ANZForm } from '@app/modules/registration/components/Form/ANZ/Form'
import { Form as UKForm } from '@app/modules/registration/components/Form/UK/Form'

type LocationState = { from: { pathname: string; search: string } }

const bookingState = { pathname: '/booking/details' }

export const RegistrationPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { login, profile, acl } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const isUKRegion = acl.isUK()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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

  const [, inserProfileTemp] = useMutation<
    InsertProfileTempMutation,
    InsertProfileTempMutationVariables
  >(INSERT_PROFILE_TEMP)

  // when login completes, we have an active profile of unverified user,
  // router sets in the available routes and we navigate to verify
  useEffect(() => {
    if (!profile) return
    if (profile && !courseId && !quantity) {
      navigate('/verify', { replace: true, state: { from } })
    }
  }, [profile, navigate, from, courseId, quantity])

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
      acceptTnc: true,
      courseId: +courseId,
      quantity: +quantity,
      dob: null,
    }

    await inserProfileTemp({ input })

    navigate(`/booking/details`, {
      replace: true,
      state: { internalBooking },
    })
  })

  if (profile) return <SuspenseLoading />

  return (
    <AppLayoutMinimal width={628}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h3"
          fontWeight="600"
          color="secondary"
          mb={1}
          align={isMobile ? 'center' : 'left'}
          textAlign={'center'}
        >
          {t(`create-free-account${acl.isAustralia() ? '-ANZ' : ''}`)}
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
      {isUKRegion ? (
        <UKForm
          onSignUp={onSignUp}
          courseId={courseId ? +courseId : null}
          quantity={quantity ? +quantity : null}
        />
      ) : (
        <ANZForm
          onSignUp={onSignUp}
          courseId={courseId ? +courseId : null}
          quantity={quantity ? +quantity : null}
        />
      )}
    </AppLayoutMinimal>
  )
}
