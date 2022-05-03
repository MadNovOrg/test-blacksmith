import { gql } from 'graphql-request'

import { Currency, PaymentMethod } from '@app/types'

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
  order: {
    id: string
    courseId: number
    profileId: string
    quantity: number
    registrants: string[]
    paymentMethod: PaymentMethod
    orderTotal: number
    currency: Currency | null
    stripePaymentId: string | null
  }
}
