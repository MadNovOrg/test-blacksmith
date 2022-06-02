import { gql } from 'graphql-request'

export type ParamsType = never

export type ResponseType = {
  initAuth: {
    email: string
    authChallenge: string
  }
}

export const QUERY = gql`
  query InitAuth {
    initAuth {
      email
      authChallenge
    }
  }
`
