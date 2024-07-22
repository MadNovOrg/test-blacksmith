import { gql } from 'urql'

export const DISABLE_PROMO_CODE = gql`
  mutation DisablePromoCode($id: uuid!) {
    update_promo_code(where: { id: { _eq: $id } }, _set: { disabled: true }) {
      affected_rows
    }
  }
`
