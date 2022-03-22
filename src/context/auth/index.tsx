import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Auth } from 'aws-amplify'
import { CognitoUser } from 'amazon-cognito-identity-js'
import useSWR from 'swr'

import { gqlRequest } from '@app/lib/gql-request'

import { injectACL, ACL } from './permissions'

import { getUserProfile } from '@app/queries/users'
import { Profile, RoleName } from '@app/types'

type E = {
  code: number
  message: string
}

type State = {
  loading: boolean
  claims?: {
    'x-hasura-user-id': string
    'x-hasura-user-email': string
    'x-hasura-allowed-roles': RoleName[]
    'x-hasura-default-role': RoleName
    'x-hasura-tt-organizations': string
  }
  accessToken?: string
  idToken?: string
}

export type LoginResult = { session?: CognitoUser; error?: E }

export interface ContextType extends State {
  login: (_: string, __: string) => Promise<LoginResult>
  logout: () => Promise<void>
  profile?: Profile
  acl: ACL
}

const initialState: State = {
  loading: true,
}

export const AuthContext = React.createContext<ContextType>({} as ContextType)

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
      } as Omit<State, 'loading'>
    }
  } catch (err) {
    // console.log(err)
  }
}

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<State>(initialState)

  useEffect(() => {
    getAuthenticatedUser().then(data => setState({ loading: false, ...data }))
  }, [])

  const { data } = useSWR<{ profile: Profile }>(
    state.claims
      ? [
          getUserProfile,
          { id: state.claims['x-hasura-user-id'] },
          state.idToken,
        ]
      : null,
    gqlRequest
  )

  const profile = useMemo(() => {
    if (data?.profile) {
      return {
        ...data.profile,
        allowedRoles: new Set(state.claims?.['x-hasura-allowed-roles'] ?? []),
      } as Profile
    }
  }, [data, state])

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

  const value = useMemo<ContextType>(() => {
    return injectACL({
      login,
      logout,
      profile,
      ...state,
    })
  }, [login, logout, state, profile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => React.useContext(AuthContext)
