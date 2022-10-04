import { GetOrdersQuery, GetOrdersQueryVariables } from '@app/generated/graphql'
import { QUERY as ORDERS_QUERY } from '@app/queries/order/get-orders'

import { getClient } from '../../hasura-api'

export async function getOrders(
  variables: GetOrdersQueryVariables
): Promise<GetOrdersQuery['orders']> {
  const client = getClient()

  const response = await client.request<
    GetOrdersQuery,
    GetOrdersQueryVariables
  >(ORDERS_QUERY, variables)

  return response.orders
}
