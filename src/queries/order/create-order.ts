import { gql } from 'graphql-request'

import { Payment_Methods_Enum } from '@app/generated/graphql'

export type ResponseType = { order: { id: string } }

export type ParamsType = {
  input: {
    courseId: number
    quantity: number
    paymentMethod: Payment_Methods_Enum
    billingAddress: string
    billingGivenName: string
    billingFamilyName: string
    billingEmail: string
    billingPhone: string
    registrants: string[]
    organizationId: string
    promoCodes: string[]
  }
}

export const MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    order: createOrder(input: $input) {
      id
    }
  }
`
