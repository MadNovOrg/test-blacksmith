import { gql } from 'urql'

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
