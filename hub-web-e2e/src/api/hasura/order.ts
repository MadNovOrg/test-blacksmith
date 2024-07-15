import {
  OrderInfoFragment,
  OrdersQuery,
  OrdersQueryVariables,
} from '@app/generated/graphql'
import { MUTATION as CREATE_ORDER } from '@app/modules/orders/queries/create-order'
import { GET_ORDERS } from '@app/modules/orders/queries/query'

import { OrderCreation } from '@qa/data/types'

import { getClient } from './client'

export async function insertOrder(input: OrderCreation): Promise<string> {
  try {
    const response = await getClient().request<{ order: { id: string } }>(
      CREATE_ORDER,
      { input: input },
    )
    console.log(
      `Inserted order with ID "${response?.order.id}" for course "${input.courseId}"`,
    )
    return response?.order.id
  } catch (error) {
    throw new Error(`Failed to create order: ${error}`)
  }
}

export async function getOrders(
  variables: OrdersQueryVariables = {
    limit: 12,
    offset: 0,
    orderBy: [],
    where: {},
  },
): Promise<OrderInfoFragment[]> {
  const response = await getClient().request<OrdersQuery, OrdersQueryVariables>(
    GET_ORDERS,
    variables,
  )
  const orders = response.order ?? []
  const filteredOrders = orders.filter(order => order !== null)
  return filteredOrders.length ? filteredOrders : []
}
