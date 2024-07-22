import { gql } from 'graphql-request'

export const UPDATE_ORG_MUTATION = gql`
  mutation UpdateOrg($org: organization_set_input = {}, $id: uuid!) {
    updated: update_organization_by_pk(pk_columns: { id: $id }, _set: $org) {
      id
    }
  }
`
