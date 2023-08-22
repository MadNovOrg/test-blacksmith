import { gql } from 'urql'

export const SAVE_ORG_INVITES_MUTATION = gql`
  mutation SaveOrgInvites($invites: [organization_invites_insert_input!]!) {
    insert_organization_invites(objects: $invites) {
      returning {
        id
      }
    }
  }
`
