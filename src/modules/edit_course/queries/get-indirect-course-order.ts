import { gql, useQuery } from 'urql'

import {
  GetOrderDetailsForReviewQuery,
  GetOrderDetailsForReviewQueryVariables,
} from '@app/generated/graphql'

export const GET_ORDER_DETAILS_FOR_REVIEW = gql`
  query GetOrderDetailsForReview($orderId: uuid!) {
    order_by_pk(id: $orderId) {
      billingAddress
      email: billingEmail
      firstName: billingGivenName
      phone: billingPhone
      organization {
        id
        name
      }
      purchaseOrder: clientPurchaseOrder
      surname: billingFamilyName
      workbookDeliveryAddress
    }
  }
`

export const useOrderDetailsForReview = (orderId: string) => {
  return useQuery<
    GetOrderDetailsForReviewQuery,
    GetOrderDetailsForReviewQueryVariables
  >({
    query: GET_ORDER_DETAILS_FOR_REVIEW,
    variables: { orderId },
    requestPolicy: 'cache-and-network',
  })
}
