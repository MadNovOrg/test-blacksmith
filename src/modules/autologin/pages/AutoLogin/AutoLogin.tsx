import { CircularProgress } from '@mui/material'
import * as Sentry from '@sentry/react'
import { Auth } from 'aws-amplify'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMount } from 'react-use'

import { useAuth } from '@app/context/auth'
import { logUserAuthEvent } from '@app/context/auth/queries/auth-audit'
import { User_Auth_Audit_Type_Enum } from '@app/generated/graphql'
import { gqlRequest } from '@app/lib/gql-request'
import {
  INIT_AUTH_QUERY,
  ResponseType as InitAuthResponseType,
} from '@app/modules/autologin/queries/init-auth'

export const AutoLogin = () => {
  const [calledLogout, setCalledLogout] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profile, loadProfile, logout } = useAuth()

  const token = searchParams.get('token')
  const continueUrl = searchParams.get('continue')

  useMount(async () => {
    const { initAuth } = await gqlRequest<InitAuthResponseType>(
      INIT_AUTH_QUERY,
      undefined,
      {
        headers: { 'x-auth': `Bearer ${token}` },
      },
    )

    await logout()
    setCalledLogout(true)

    const user = await Auth.signIn(initAuth.email)
    await Auth.sendCustomChallengeAnswer(user, initAuth.authChallenge)

    const currentUser = await Auth.currentUserPoolUser()
    const loadedProfile = await loadProfile(currentUser)

    if (loadedProfile?.profile) {
      const token = user.signInUserSession.getIdToken().getJwtToken()
      try {
        await logUserAuthEvent(
          {
            event_type: User_Auth_Audit_Type_Enum.Login,
            sub: currentUser.attributes.sub,
          },
          token,
        )
      } catch (err) {
        Sentry.captureException(err)
      }
    }
  })

  useEffect(() => {
    if (!profile || !continueUrl) return

    if (calledLogout) {
      setCalledLogout(false)
      navigate(continueUrl, { replace: true })
    }
  }, [profile, navigate, continueUrl, calledLogout])

  return <CircularProgress size={50} />
}
