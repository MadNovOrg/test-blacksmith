import {
  GetOrdersInput,
  GetOrdersQuery,
  OrderInfo,
  Query_RootGetOrdersArgs,
} from '@app/generated/graphql'
import { GET_ORDERS } from '@app/pages/tt-pages/Orders/query'

import { getClient } from '../../hasura-api'

export async function getOrders(
  variables: GetOrdersInput
): Promise<Array<OrderInfo>> {
  const response = await getClient().request<
    GetOrdersQuery,
    Query_RootGetOrdersArgs
  >(GET_ORDERS, { input: variables })
  const orders = response.getOrders?.orders ?? []
  const filteredOrders = orders.filter(order => order !== null) as OrderInfo[]
  return filteredOrders.length ? filteredOrders : []
}
