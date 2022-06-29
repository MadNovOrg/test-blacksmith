import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation SaveOrgInvites($invites: [organization_invites_insert_input!]!) {
    insert_organization_invites(objects: $invites) {
      returning {
        id
      }
    }
  }
`
