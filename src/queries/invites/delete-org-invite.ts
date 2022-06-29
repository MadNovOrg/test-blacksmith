import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation DeleteOrgInvite($inviteId: uuid!) {
    delete_organization_invites_by_pk(id: $inviteId) {
      id
    }
  }
`
