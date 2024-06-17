import { Auth } from 'aws-amplify'
import posthog from 'posthog-js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { gqlRequest } from '@app/lib/gql-request'
import { MUTATION as UPDATE_PROFILE_ACTIVITY_QUERY } from '@app/modules/profile/queries/update-profile-activity'
import { RoleName } from '@app/types'

import { TTCookies } from './cookies'
import { fetchUserProfile, lsActiveRoleClient } from './helpers'
import { injectACL } from './permissions'
import type { AuthContextType, AuthState, CognitoUser, E } from './types'

export const AuthContext = React.createContext({} as AuthContextType)
export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<AuthState>({})

  const loadProfile = useCallback(async (user: CognitoUser) => {
    const data = await fetchUserProfile(user)
    let token = ''

    if (data?.profile) {
      const idToken = (await Auth.currentSession()).getIdToken()
      const expiryUnixSeconds = idToken.getExpiration()
      token = idToken.getJwtToken()

      // write to cookie
      TTCookies.setCookie('mo_jwt_token', token, {
        secure: true,
        expires: expiryUnixSeconds * 1000,
        path: '/',
        domain: '.teamteach.com',
        sameSite: 'Strict',
      })

      // delete the "signout" cookie if it exists
      TTCookies.deleteCookie('tt_logout', {
        secure: true,
        path: '/',
        domain: '.teamteach.com',
        sameSite: 'Strict',
      })

      posthog.identify(data.profile.id, { email: data.profile.email })
    }

    setState({ ...data })
    setLoading(false)

    if (data?.profile && token) {
      await gqlRequest(
        UPDATE_PROFILE_ACTIVITY_QUERY,
        { profileId: data.profile.id },
        {
          token,
          role: data.activeRole,
        }
      )
    }
  }, [])

  const onUserNotLoggedIn = () => {
    // delete cookie if exists
    TTCookies.deleteCookie('mo_jwt_token', {
      secure: true,
      path: '/',
      domain: '.teamteach.com',
      sameSite: 'Strict',
    })

    // raise a cookie to tell other team teach sites to logout
    TTCookies.setCookie('tt_logout', 'true', {
      secure: true,
      expires: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
      domain: '.teamteach.com',
      sameSite: 'Strict',
    })
  }

  // On initial load, check if user is logged in and load the profile
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(loadProfile)
      .catch(() => {
        onUserNotLoggedIn()
        setLoading(false)
      })
  }, [loadProfile])

  const reloadCurrentProfile = useCallback(() => {
    return Auth.currentAuthenticatedUser()
      .then(loadProfile)
      .catch(() => {
        onUserNotLoggedIn()
      })
  }, [loadProfile])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const user = await Auth.signIn(email, password)
        await loadProfile(user)
        return { user, error: undefined }
      } catch (err) {
        return { error: err as E }
      }
    },
    [loadProfile]
  )

  const logout = useCallback(async () => {
    await Auth.signOut()
    onUserNotLoggedIn()
    setState({ loggedOut: true })

    posthog.identify('1')
    localStorage.removeItem('residingCountryDialogWasDisplayed')
  }, [])

  const getJWT = useCallback(async () => {
    try {
      const session = await Auth.currentSession()
      return session.getIdToken().getJwtToken()
    } catch (err) {
      console.error(err)
      return ''
    }
  }, [])

  const changeRole = useCallback(
    (activeRole: RoleName) => {
      if (!state.profile) return state.activeRole
      if (!state.allowedRoles?.has(activeRole)) return state.activeRole
      if (!state.claimsRoles) return state.activeRole

      lsActiveRoleClient(state.profile).set(activeRole)
      setState(prev => ({
        ...prev,
        activeRole,
        queryRole: activeRole,
      }))
      return activeRole
    },
    [state]
  )

  const value = useMemo(() => {
    return injectACL({
      ...state,
      loading,
      login,
      logout,
      getJWT,
      changeRole,
      loadProfile,
      reloadCurrentProfile,
    })
  }, [
    login,
    logout,
    getJWT,
    changeRole,
    state,
    loading,
    loadProfile,
    reloadCurrentProfile,
  ])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
