import { gql } from 'graphql-request'

import {
  CreateOrderOutput,
  CreateOrderMutationVariables,
} from '@app/generated/graphql'

export type ResponseType = CreateOrderOutput

export type ParamsType = CreateOrderMutationVariables

export const MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    order: createOrder(input: $input) {
      id
      success
      error
    }
  }
`
