import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation RemoveOrgMember($id: uuid!) {
    delete_organization_member_by_pk(id: $id) {
      id
    }
  }
`
