import { gql } from 'graphql-request'

import { Order } from '@app/types'

export type ParamsType = { orderId: string }

export const QUERY = gql`
  query GetOrder($orderId: uuid!) {
    order: order_by_pk(id: $orderId) {
      id
      courseId
      profileId
      quantity
      registrants
      paymentMethod
      orderDue
      orderTotal
      currency
      stripePaymentId
      promoCodes
      xeroInvoiceNumber
    }
  }
`

export type ResponseType = { order: Order }
