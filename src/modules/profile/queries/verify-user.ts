import { gql } from 'graphql-request'

export type ParamsType = { inviteId: string }

export type ResponseType = {
  verifyUser: boolean
}

export const VERIFY_USER_MUTATION = gql`
  mutation VerifyUser($inviteId: uuid!) {
    verifyUser(inviteId: $inviteId)
  }
`
