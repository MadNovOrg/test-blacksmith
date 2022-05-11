import { gql } from 'graphql-request'

import { Order } from '@app/types'

export const QUERY = gql`
  query GetOrder($orderId: uuid!) {
    order: order_by_pk(id: $orderId) {
      id
      courseId
      profileId
      quantity
      registrants
      paymentMethod
      orderTotal
      currency
      stripePaymentId
    }
  }
`

export type ResponseType = {
  order: Order
}
