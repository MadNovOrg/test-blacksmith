import { gql } from 'graphql-request'

export const CAN_APPLY_PROMO_CODE = gql`
  query CanApplyPromoCode($input: CanApplyPromoCodeInput!) {
    canApplyPromoCode(input: $input) {
      result {
        code
        amount
        type
      }
    }
  }
`
