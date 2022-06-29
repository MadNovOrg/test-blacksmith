import { gql } from 'graphql-request'

import { GetPromoCodesQueryVariables, Query_Root } from '@app/generated/graphql'

export type InputType = GetPromoCodesQueryVariables & {
  limit?: number
  offset?: number
}

export type ResponseType = {
  promoCodes: Query_Root['promo_code']
  promo_code_aggregate: { aggregate: { count: number } }
}

export const QUERY = gql`
  query GetPromoCodes(
    $orderBy: [promo_code_order_by!]
    $where: promo_code_bool_exp
    $limit: Int = 20
    $offset: Int = 0
  ) {
    promoCodes: promo_code(
      order_by: $orderBy
      where: $where
      limit: $limit
      offset: $offset
    ) {
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
      creator {
        id
        fullName
      }
      createdAt
      updatedAt
    }

    promo_code_aggregate {
      aggregate {
        count
      }
    }
  }
`
