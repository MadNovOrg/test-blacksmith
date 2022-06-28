import { gql } from 'graphql-request'

export default gql`
  mutation InsertPromoCode($promoCode: promo_code_insert_input!) {
    insert_promo_code_one(object: $promoCode) {
      id
    }
  }
`
