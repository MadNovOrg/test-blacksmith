import { gql } from 'urql'

export const GET_ORG_TYPES = gql`
  query getOrgTypes($where: organization_type_bool_exp!) {
    organization_type(where: $where, order_by: { name: asc }) {
      id
      name
    }
  }
`
