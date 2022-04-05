import { Auth } from 'aws-amplify'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { RoleName } from '@app/types'

import { fetchUserProfile, lsActiveRoleClient } from './helpers'
import { injectACL } from './permissions'
import type { AuthContextType, CognitoUser, AuthState, E } from './types'

export const AuthContext = React.createContext({} as AuthContextType)
export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<AuthState>({})

  const loadProfile = useCallback(async (user: CognitoUser) => {
    const data = await fetchUserProfile(user)
    setState({ ...data })
    setLoading(false)
  }, [])

  // On initial load, check if user is logged in and load the profile
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(loadProfile)
      .catch(() => setLoading(false))
  }, [loadProfile])

  const login = useCallback(
    async (email, password) => {
      try {
        const user = await Auth.signIn(email, password)
        await loadProfile(user)
        return { error: undefined }
      } catch (err) {
        return { error: err as E }
      }
    },
    [loadProfile]
  )

  const logout = useCallback(async () => {
    await Auth.signOut()
    setState({})
  }, [])

  const changeRole = useCallback(
    (activeRole: RoleName) => {
      if (!state.profile) return state.activeRole
      if (!state.allowedRoles?.has(activeRole)) return state.activeRole

      lsActiveRoleClient(state.profile).set(activeRole)
      setState(prev => ({ ...prev, activeRole }))
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
      changeRole,
    })
  }, [login, logout, changeRole, state, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
