import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Auth } from 'aws-amplify'
import { CognitoUser } from 'amazon-cognito-identity-js'
import useSWR from 'swr'

import { getUserProfile } from '@app/queries/users'
import { fetcher } from '@app/App'
import { Profile } from '@app/types'

type E = {
  code: number
  message: string
}

type State = {
  loading: boolean
  claims?: { [key: string]: string }
  accessToken?: string
  idToken?: string
}

type LoginResult = { session?: CognitoUser; error?: E }

interface ContextType extends State {
  login: (_: string, __: string) => Promise<LoginResult>
  logout: () => Promise<void>
  profile?: Profile
}

const initialState: State = {
  loading: true,
}

const AuthContext = React.createContext<ContextType>({} as ContextType)

async function getAuthenticatedUser() {
  try {
    const sessionResult: CognitoUser = await Auth.currentAuthenticatedUser()
    const session = sessionResult.getSignInUserSession()

    if (session) {
      const idToken = session.getIdToken()
      const accessToken = session.getAccessToken()
      const claims = idToken.payload['https://hasura.io/jwt/claims']

      return {
        claims: JSON.parse(claims),
        accessToken: accessToken.getJwtToken(),
        idToken: idToken.getJwtToken(),
      }
    }
  } catch (err) {
    // console.log(err)
    return null
  }
}

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<State>(initialState)

  const { data } = useSWR<{ profile: Profile }>(
    state.claims
      ? [
          getUserProfile,
          { id: state.claims['x-hasura-user-id'] },
          state.idToken,
        ]
      : null,
    fetcher
  )

  useEffect(() => {
    getAuthenticatedUser()
      .then(data => {
        if (data) {
          setState({ loading: false, ...data })
        } else {
          setState({ loading: false })
        }
      })
      .catch(() => setState({ loading: false }))
  }, [])

  const login = useCallback<ContextType['login']>(async (email, password) => {
    try {
      const signInResult: CognitoUser = await Auth.signIn(email, password)
      const session = signInResult.getSignInUserSession()

      if (session) {
        const idToken = session.getIdToken()
        const accessToken = session.getAccessToken()
        const claims = idToken.payload['https://hasura.io/jwt/claims']

        setState({
          loading: false,
          claims: JSON.parse(claims),
          accessToken: accessToken.getJwtToken(),
          idToken: idToken.getJwtToken(),
        })
      }

      return { session: signInResult }
    } catch (err) {
      const error = err as E
      return { error }
    }
  }, [])

  const logout = useCallback<ContextType['logout']>(async () => {
    await Auth.signOut()

    setState({ loading: false })
  }, [])

  const value = useMemo<ContextType>(
    () => ({
      login,
      logout,
      profile: data?.profile,
      ...state,
    }),
    [login, logout, data, state]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => React.useContext(AuthContext)
