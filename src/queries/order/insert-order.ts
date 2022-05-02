import { gql } from 'graphql-request'

import { PaymentMethod } from '@app/types'

export type ResponseType = { order: { id: string } }

export type ParamsType = {
  input: {
    courseId: number
    quantity: number
    paymentMethod: PaymentMethod
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
  mutation InsertOrder($input: order_insert_input!) {
    order: insert_order_one(object: $input) {
      id
    }
  }
`
