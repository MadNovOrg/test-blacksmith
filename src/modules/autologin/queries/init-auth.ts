import { gql } from 'graphql-request'

export type ParamsType = never

export type ResponseType = {
  initAuth: {
    email: string
    authChallenge: string
  }
}

export const INIT_AUTH_QUERY = gql`
  query InitAuth {
    initAuth {
      email
      authChallenge
    }
  }
`
