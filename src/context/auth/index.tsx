import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Auth } from 'aws-amplify'

import { fetchUserProfile } from './helpers'
import type { AuthContextType, CognitoUser, AuthState, E } from './types'
import { injectACL } from './permissions'

export const AuthContext = React.createContext({} as AuthContextType)
export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<AuthState>({ loading: true })

  const loadProfile = useCallback(async (user: CognitoUser) => {
    const data = (await fetchUserProfile(user)) as Omit<AuthState, 'loading'>
    setState({ loading: false, ...data })
  }, [])

  // On initial load, check if user is logged in and load the profile
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(loadProfile)
      .catch(() => setState({ loading: false }))
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
    setState({ loading: false })
  }, [])

  const value = useMemo(() => {
    return injectACL({
      ...state,
      profile: state.profile,
      login,
      logout,
    })
  }, [login, logout, state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
