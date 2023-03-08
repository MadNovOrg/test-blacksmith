import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation RecreateOrgInvite($inviteId: uuid!) {
    update_organization_invites_by_pk(
      pk_columns: { id: $inviteId }
      _set: { updatedAt: "now()" }
    ) {
      id
    }
  }
`
