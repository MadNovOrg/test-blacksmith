import { gql } from 'urql'

export const GET_ORDER_REDUCED = gql`
  query GetOrderReduced($orderId: uuid!) {
    order: order_by_pk(id: $orderId) {
      id
      xeroInvoiceNumber
    }
  }
`
