import { gql } from 'graphql-request'

export const QUERY = gql`
  query CanApplyPromoCode($input: CanApplyPromoCodeInput!) {
    canApplyPromoCode(input: $input) {
      result
    }
  }
`
