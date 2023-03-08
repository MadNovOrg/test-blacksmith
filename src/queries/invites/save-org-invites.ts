import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation SaveOrgInvites($invites: [organization_invites_insert_input!]!) {
    insert_organization_invites(
      objects: $invites
      on_conflict: {
        constraint: organization_invites_org_id_email_key
        update_columns: [updatedAt, isAdmin, status]
        where: { status: { _neq: "ACCEPTED" } }
      }
    ) {
      returning {
        id
      }
    }
  }
`
