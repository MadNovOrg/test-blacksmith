import { CircularProgress } from '@mui/material'
import { Auth } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMount } from 'react-use'

import { useAuth } from '@app/context/auth'
import { gqlRequest } from '@app/lib/gql-request'
import {
  ParamsType as InitAuthParamsType,
  QUERY as INIT_AUTH_QUERY,
  ResponseType as InitAuthResponseType,
} from '@app/queries/invites/init-auth'

export const AutoLogin = () => {
  const [calledLogout, setCalledLogout] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { profile, loadProfile, logout } = useAuth()

  const token = searchParams.get('token')
  const continueUrl = searchParams.get('continue')

  useMount(async () => {
    const { initAuth } = await gqlRequest<
      InitAuthResponseType,
      InitAuthParamsType
    >(INIT_AUTH_QUERY, undefined, {
      headers: { 'x-auth': `Bearer ${token}` },
    })

    await logout()
    setCalledLogout(true)

    const user = await Auth.signIn(initAuth.email)
    await Auth.sendCustomChallengeAnswer(user, initAuth.authChallenge)

    const currentUser = await Auth.currentUserPoolUser()
    await loadProfile(currentUser)
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
