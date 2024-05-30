import { gql } from 'urql'

import {
  OrderInfoFragment,
  OrdersQuery,
  OrdersQueryVariables,
} from '@app/generated/graphql'
import { GET_ORDERS } from '@app/pages/tt-pages/Orders/query'
import { MUTATION as CREATE_ORDER } from '@app/queries/order/create-order'

import { OrderCreation } from '@qa/data/types'

import { getClient } from './client'

export async function insertOrder(input: OrderCreation): Promise<string> {
  try {
    const response = await getClient().request<{ order: { id: string } }>(
      CREATE_ORDER,
      { input: input }
    )
    console.log(
      `Inserted order with ID "${response?.order.id}" for course "${input.courseId}"`
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
  }
): Promise<OrderInfoFragment[]> {
  const response = await getClient().request<OrdersQuery, OrdersQueryVariables>(
    GET_ORDERS,
    variables
  )
  const orders = response.order ?? []
  const filteredOrders = orders.filter(order => order !== null)
  return filteredOrders.length ? filteredOrders : []
}

export async function deleteOrderById(orderId: string): Promise<string> {
  const DELETE_ORDER = gql`
    mutation DeleteOrder($orderId: uuid!) {
      delete_course_order(where: { order_id: { _eq: $orderId } }) {
        affected_rows
      }
      delete_order(where: { id: { _eq: $orderId } }) {
        affected_rows
      }
    }
  `

  try {
    const variables = { orderId }
    const response = await getClient().request<{
      delete_order: { affected_rows: number; returning: Array<{ id: number }> }
    }>(DELETE_ORDER, variables)

    if (response.delete_order.affected_rows > 0) {
      console.log(`Successfully deleted order with ID "${orderId}".`)
      return `Deleted ${response.delete_order.affected_rows} records.`
    } else {
      console.error(`No order found with ID "${orderId}". No records deleted.`)
      return `No records deleted.`
    }
  } catch (error) {
    throw new Error(`Error deleting order: ${error}`)
  }
}
