import { gql } from 'graphql-request'

import { Order, SortOrder } from '@app/types'

export const QUERY = gql`
  query GetOrders($orderBy: [order_order_by!], $where: order_bool_exp) {
    orders: order(order_by: $orderBy, where: $where) {
      id
      createdAt
      profileId
      quantity
      registrants
      paymentMethod
      orderTotal
      currency
      stripePaymentId
      course {
        name
      }
      organization {
        name
      }
    }
  }
`

export type InputType = {
  orderBy?: {
    createdAt?: SortOrder
    orderTotal?: SortOrder
  }
  where?: {
    createdAt?: { _gte?: Date; _lte?: Date }
  }
}

export type ResponseType = {
  orders: Array<
    Pick<
      Order,
      | 'id'
      | 'createdAt'
      | 'profileId'
      | 'quantity'
      | 'registrants'
      | 'paymentMethod'
      | 'orderTotal'
      | 'currency'
      | 'stripePaymentId'
    > & {
      course: Pick<Order['course'], 'name'>
      organizations: Pick<Order['organization'], 'name'>
    }
  >
}
