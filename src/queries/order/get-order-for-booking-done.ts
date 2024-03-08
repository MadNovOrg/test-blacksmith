import { gql } from 'urql'

export const ORDER_FOR_BOOKING_DONE = gql`
  query GetOrderForBookingDone($orderId: uuid!) {
    order: order_by_pk(id: $orderId) {
      id
      xeroInvoiceNumber
      paymentMethod
    }
  }
`
