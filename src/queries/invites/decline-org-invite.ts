import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation DeclineOrgInvite($inviteId: uuid!) {
    invite: declineOrgInvite(inviteId: $inviteId)
  }
`
