import { gql } from 'graphql-request'

export type ParamsType = unknown

export type ResponseType = {
  createUser: { id: string; email: string; authChallenge: string | null }
}

export const MUTATION = gql`
  mutation CreateUser {
    createUser {
      id
      email
      authChallenge
    }
  }
`
