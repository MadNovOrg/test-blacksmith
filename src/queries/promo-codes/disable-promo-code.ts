import { gql } from 'graphql-request'

export default gql`
  mutation DisablePromoCode($id: uuid!) {
    update_promo_code(where: { id: { _eq: $id } }, _set: { disabled: true }) {
      affected_rows
    }
  }
`
