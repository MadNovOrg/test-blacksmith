import { gql } from 'graphql-request'

export const APPROVE_CODE = gql`
  mutation ApproveCode($id: uuid!, $approvedBy: uuid) {
    update_promo_code_by_pk(
      pk_columns: { id: $id }
      _set: { approvedBy: $approvedBy }
    ) {
      id
    }
  }
`

export const DENY_CODE = gql`
  mutation DenyCode($id: uuid!, $deniedBy: uuid) {
    update_promo_code_by_pk(
      pk_columns: { id: $id }
      _set: { deniedBy: $deniedBy }
    ) {
      id
    }
  }
`
