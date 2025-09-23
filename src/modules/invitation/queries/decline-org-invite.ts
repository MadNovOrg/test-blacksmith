import { gql } from 'graphql-request'

export const DECLINE_ORG_INVITE_MUTATION = gql`
  mutation DeclineOrgInvite($inviteId: uuid!) {
    invite: declineOrgInvite(inviteId: $inviteId)
  }
`
