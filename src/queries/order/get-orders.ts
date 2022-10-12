import { gql } from 'graphql-request'

import { Order, Course, Currency, SortOrder, PaymentMethod } from '@app/types'

export const QUERY = gql`
  query GetOrders(
    $orderBy: [order_order_by!]
    $where: order_bool_exp
    $limit: Int = 20
    $offset: Int = 0
  ) {
    orders: order(
      order_by: $orderBy
      where: $where
      limit: $limit
      offset: $offset
    ) {
      id
      createdAt
      profileId
      quantity
      registrants
      paymentMethod
      orderDue
      orderTotal
      currency
      stripePaymentId
      xeroInvoiceNumber
      course {
        name
        schedule {
          start
        }
      }
      organization {
        name
      }
      promoCodes
    }

    order_aggregate {
      aggregate {
        count
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
    currency?: Currency[]
    paymentMethod?: PaymentMethod[]
    course?: { name_contains: string }
  }
  limit?: number
  offset?: number
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
      | 'orderDue'
      | 'orderTotal'
      | 'currency'
      | 'stripePaymentId'
      | 'promoCodes'
      | 'xeroInvoiceNumber'
    > & {
      course: Pick<Order['course'], 'name'> & {
        schedule: Pick<Course['schedule'][number], 'start'>
      }
      organization: Pick<Order['organization'], 'name'>
    }
  >
  order_aggregate: {
    aggregate: {
      count: number
    }
  }
}
