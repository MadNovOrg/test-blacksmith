import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    order: createOrder(input: $input) {
      id
    }
  }
`
