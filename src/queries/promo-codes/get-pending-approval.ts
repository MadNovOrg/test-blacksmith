import { gql } from 'graphql-request'

export const QUERY = gql`
  query GetPromoCodesPendingApproval {
    promoCodes: promo_code(
      where: {
        approvedBy: { _is_null: true }
        deniedBy: { _is_null: true }
        _or: [
          { amount: { _gt: 15 }, type: { _eq: PERCENT } }
          { amount: { _gt: 3 }, type: { _eq: FREE_PLACES } }
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
      courses {
        course {
          id
          course_code
        }
      }
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
