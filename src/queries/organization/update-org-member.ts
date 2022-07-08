import { gql } from 'graphql-request'

export type ParamsType = {
  id: string
  member: {
    position: string | null
    isAdmin: boolean
  }
}

export const MUTATION = gql`
  mutation UpdateOrgMember(
    $id: uuid!
    $member: organization_member_set_input!
  ) {
    updated: update_organization_member_by_pk(
      pk_columns: { id: $id }
      _set: $member
    ) {
      id
    }
  }
`
