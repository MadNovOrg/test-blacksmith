import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation UpdateProfileRoles(
    $id: uuid!
    $roles: [profile_role_insert_input!]!
  ) {
    delete_profile_role(where: { profile_id: { _eq: $id } }) {
      affected_rows
    }
    insert_profile_role(objects: $roles) {
      affected_rows
    }
  }
`
