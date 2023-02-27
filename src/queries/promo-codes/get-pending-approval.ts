import { gql } from 'graphql-request'

import {
  GetPromoCodesQueryVariables,
  Promo_Code_Type_Enum,
  Query_Root,
} from '@app/generated/graphql'

export type InputType = GetPromoCodesQueryVariables

export type ResponseType = {
  promoCodes: Query_Root['promo_code']
}

export const QUERY = gql`
  query GetPromoCodesPendingApproval {
    promoCodes: promo_code(
      where: {
        approvedBy: { _is_null: true }
        deniedBy: { _is_null: true }
        _or: [
          {
            amount: { _gt: 15 }
            type: { _eq: ${Promo_Code_Type_Enum.Percent} }
          }
          {
            amount: { _gt: 3 }
            type: { _eq: ${Promo_Code_Type_Enum.FreePlaces} }
          }
        ]
      }
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
          avatar
          archived
      }
      createdAt
      updatedAt
    }
  }
`
