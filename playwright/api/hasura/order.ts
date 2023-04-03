import { gql } from 'graphql-request'

import {
  OrderInfoFragment,
  OrdersQuery,
  OrdersQueryVariables,
} from '@app/generated/graphql'
import { GET_ORDERS } from '@app/pages/tt-pages/Orders/query'

import { OrderCreation } from '../../data/types'

import { getClient } from './client'

export async function insertOrder(input: OrderCreation): Promise<number> {
  const mutation = gql`
    mutation InsertOrder($object: order_insert_input!) {
      order: insert_order_one(object: $object) {
        id
      }
    }
  `
  try {
    const response = await getClient().request<{ order: { id: number } }>(
      mutation,
      { object: input }
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
