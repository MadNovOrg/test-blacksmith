import { gql } from 'graphql-request'

export type ParamsType = unknown

export type ResponseType = {
  createAppUser: { id: string; email: string; authChallenge: string | null }
}

export const MUTATION = gql`
  mutation CreateAppUser {
    createAppUser {
      id
      email
      authChallenge
    }
  }
`
