import { CircularProgress } from '@mui/material'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '@app/context/auth'
import { gqlRequest } from '@app/lib/gql-request'
import {
  INIT_AUTH_QUERY,
  ResponseType as InitAuthResponseType,
} from '@app/modules/autologin/queries/init-auth'

export const AutoLogin = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { loading: loadingProfile, profile, logout } = useAuth()

  const token = searchParams.get('token')
  const continueUrl = searchParams.get('continue')
  const role = searchParams.get('role')

  const autologinHasRun = useRef<boolean>(false)

  const autologin = useCallback(async () => {
    if (!loadingProfile) {
      const { initAuth } = await gqlRequest<InitAuthResponseType>(
        INIT_AUTH_QUERY,
        undefined,
        {
          headers: { 'x-auth': `Bearer ${token}` },
        },
      )

      if (
        !profile?.email ||
        profile.email.trim().toLowerCase() !==
          initAuth.email.trim().toLowerCase()
      ) {
        await logout(true)
      }

      if (continueUrl) {
        const url = new URL(continueUrl, window.location.origin)

        if (role) {
          url.searchParams.set('role', role)
        }

        const params = url.searchParams.toString()

        navigate(`${url.pathname}${params ? '?' + params : ''}`, {
          replace: true,
          state: { email: initAuth.email },
        })
      }
    }
  }, [
    continueUrl,
    loadingProfile,
    logout,
    navigate,
    profile?.email,
    role,
    token,
  ])

  useEffect(() => {
    if (!loadingProfile && !autologinHasRun.current) {
      autologin()
      autologinHasRun.current = true
    }
  }, [autologin, loadingProfile])

  return <CircularProgress size={50} />
}
