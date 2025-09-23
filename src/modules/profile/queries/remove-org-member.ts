import { gql } from 'graphql-request'

export const REMOVE_ORG_MEMBER_MUTATION = gql`
  mutation RemoveOrgMember($id: uuid!) {
    delete_organization_member_by_pk(id: $id) {
      id
    }
  }
`
