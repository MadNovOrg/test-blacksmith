import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation RecreateOrgInvite(
    $inviteId: uuid!
    $orgId: uuid!
    $email: String!
    $isAdmin: Boolean!
  ) {
    delete_organization_invites_by_pk(id: $inviteId) {
      id
    }
    insert_organization_invites_one(
      object: { orgId: $orgId, email: $email, isAdmin: $isAdmin }
    ) {
      id
    }
  }
`
