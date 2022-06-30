import { gql } from 'graphql-request'

export type ResponseType = {
  invite: { id: string }
}

export const MUTATION = gql`
  mutation DeclineOrgInvite {
    invite: declineOrgInvite {
      id
    }
  }
`
