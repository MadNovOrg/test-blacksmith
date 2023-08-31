import { Auth } from 'aws-amplify'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { gqlRequest } from '@app/lib/gql-request'
import { MUTATION as UPDATE_PROFILE_ACTIVITY_QUERY } from '@app/queries/profile/update-profile-activity'
import { RoleName } from '@app/types'

import { fetchUserProfile, getQueryRole, lsActiveRoleClient } from './helpers'
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
    setState({ ...data })
    setLoading(false)

    if (data?.profile) {
      const idToken = (await Auth.currentSession()).getIdToken()
      const expiryUnixSeconds = idToken.getExpiration()
      const token = idToken.getJwtToken()

      await gqlRequest(
        UPDATE_PROFILE_ACTIVITY_QUERY,
        { profileId: data.profile.id },
        {
          token,
          role: data.activeRole,
        }
      )

      // write to cookie
      Cookies.set('mo_jwt_token', token, {
        secure: true,
        expires: expiryUnixSeconds * 1000,
        path: '/',
        domain: '.teamteach.com',
        sameSite: 'Strict',
      })
    }
  }, [])

  // On initial load, check if user is logged in and load the profile
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(loadProfile)
      .catch(() => setLoading(false))
  }, [loadProfile])

  const reloadCurrentProfile = useCallback(() => {
    return Auth.currentAuthenticatedUser().then(loadProfile)
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
    // delete cookie if exists
    Cookies.remove('mo_jwt_token', {
      secure: true,
      path: '/',
      domain: '.teamteach.com',
      sameSite: 'Strict',
    })
    setState({ loggedOut: true })
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
        queryRole: getQueryRole(activeRole, state.claimsRoles ?? new Set()),
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
