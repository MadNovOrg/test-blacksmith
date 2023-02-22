import {
  GetOrdersInput,
  GetOrdersQuery,
  OrderInfo,
} from '@app/generated/graphql'
import { GET_ORDERS as ORDERS_QUERY } from '@app/pages/tt-pages/Orders/query'

import { getClient } from '../../hasura-api'

export async function getOrders(
  variables: GetOrdersInput
): Promise<Array<OrderInfo>> {
  const client = getClient()

  const response = await client.request<GetOrdersQuery, GetOrdersInput>(
    ORDERS_QUERY,
    variables
  )
  if (
    response.getOrders?.orders !== null ||
    response.getOrders?.orders !== undefined
  ) {
    return [{ id: 'error' }]
  }

  return response.getOrders.orders
}
