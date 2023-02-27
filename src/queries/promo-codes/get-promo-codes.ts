import { gql } from 'graphql-request'

import {
  GetPromoCodesQuery,
  GetPromoCodesQueryVariables,
} from '@app/generated/graphql'

export type InputType = GetPromoCodesQueryVariables

export type ResponseType = GetPromoCodesQuery

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
      courses {
        course {
          id
          course_code
        }
      }
      enabled
      approvedBy
      deniedBy
      createdBy
      creator {
        id
        fullName
        avatar
        archived
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
