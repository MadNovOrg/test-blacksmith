import { gql } from 'graphql-request'

export type ParamsType = { inviteId: string }

export type ResponseType = {
  verifyUser: boolean
}

export const MUTATION = gql`
  mutation VerifyUser($inviteId: uuid!) {
    verifyUser(inviteId: $inviteId)
  }
`
