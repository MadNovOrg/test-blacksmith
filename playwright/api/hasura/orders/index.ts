import {
  OrderInfoFragment,
  OrdersQuery,
  OrdersQueryVariables,
} from '@app/generated/graphql'
import { GET_ORDERS } from '@app/pages/tt-pages/Orders/query'

import { getClient } from '../../hasura-api'

export async function getOrders(
  variables: OrdersQueryVariables
): Promise<OrderInfoFragment[]> {
  const response = await getClient().request<OrdersQuery, OrdersQueryVariables>(
    GET_ORDERS,
    variables
  )
  const orders = response.order ?? []
  const filteredOrders = orders.filter(order => order !== null)
  return filteredOrders.length ? filteredOrders : []
}
