import { gql } from 'graphql-request'

export type ParamsType = unknown

export type ResponseType = {
  createUser: {
    cognitoId: string
    profileId: string
    email: string
    authChallenge: string | null
  }
}

export const MUTATION = gql`
  mutation CreateUser {
    createUser {
      cognitoId
      profileId
      email
      authChallenge
    }
  }
`
