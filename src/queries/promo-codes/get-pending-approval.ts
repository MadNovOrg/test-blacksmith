import { gql } from 'graphql-request'

import { GetPromoCodesQueryVariables, Query_Root } from '@app/generated/graphql'

export type InputType = GetPromoCodesQueryVariables

export type ResponseType = {
  promoCodes: Query_Root['promo_code']
}

export const QUERY = gql`
  query GetPromoCodesPendingApproval {
    promoCodes: promo_code(
      where: { approvedBy: { _is_null: true }, deniedBy: { _is_null: true } }
      order_by: { createdBy: asc }
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
  }
`
