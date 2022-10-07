import { gql } from 'graphql-request'

import {
  CreateOrderMutation,
  CreateOrderMutationVariables,
} from '@app/generated/graphql'

export type ResponseType = CreateOrderMutation

export type ParamsType = CreateOrderMutationVariables

export const MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    order: createOrder(input: $input) {
      id
    }
  }
`
