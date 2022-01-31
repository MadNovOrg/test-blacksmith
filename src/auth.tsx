import React, { useState, useEffect } from 'react'
import CognitoUser, { Auth } from 'aws-amplify'

const initialState = {
  loading: true,
  accessToken: null,
}

export interface State {
  loading: boolean
  claims: { [key: string]: string } | null
  role: string | null
  accessToken: string | null
}

type E = {
  code: number
  message: string
}
interface AuthContextType extends State {
  login: (
    email: string,
    password: string
  ) => Promise<{
    session?: typeof CognitoUser
    error?: E
  }>
  logout: () => Promise<void>
}

const AuthContext = React.createContext(initialState as AuthContextType)

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [state, setState] = useState<State>({
    ...initialState,
    claims: null,
    role: null,
  })

  useEffect(() => {
    Auth.currentSession()
      .then(data => {
        console.log(data)
        setState(s => ({
          ...s,
          loading: false,
          accessToken: data.getAccessToken().getJwtToken(),
        }))
      })
      .catch(err => {
        console.log(err)
        setState(s => ({
          ...s,
          loading: false,
          accessToken: null,
        }))
      })
  }, [])

  const login = async (
    email: string,
    password: string
  ): Promise<{
    session?: typeof CognitoUser
    error?: E
  }> => {
    try {
      const session = await Auth.signIn(email, password)

      setState(s => ({
        ...s,
        userSession: session,
        claims: null,
        role: null,
        accessToken: session.signInUserSession.accessToken,
      }))
      return { session }
    } catch (err: unknown) {
      const error = err as E
      return { error }
    }
  }

  const logout = async (): Promise<void> => {
    await Auth.signOut()

    setState(s => ({
      ...s,
      userSession: null,
      claims: null,
      role: null,
      accessToken: null,
    }))
  }

  const value = { login, logout, ...state }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useSession = () => React.useContext(AuthContext)

export default SessionProvider
