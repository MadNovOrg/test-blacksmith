import { gql } from 'graphql-request'

import { GetPromoCodesQueryVariables, Query_Root } from '@app/generated/graphql'

export type InputType = GetPromoCodesQueryVariables
export type ResponseType = { promoCodes: Query_Root['promo_code'] }

export const QUERY = gql`
  query GetPromoCodes(
    $orderBy: [promo_code_order_by!]
    $where: promo_code_bool_exp
  ) {
    promoCodes: promo_code(order_by: $orderBy, where: $where) {
      id
      code
      description
      type
      amount
      validFrom
      validTo
      bookerSingleUse
      usesMax
      levels
      courses
      enabled
      approvedBy
      createdBy
      createdAt
      updatedAt
    }
  }
`
