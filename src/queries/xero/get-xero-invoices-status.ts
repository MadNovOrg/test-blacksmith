import { gql } from 'graphql-request'

import { OrderStatus } from '@app/types'

export type ResponseType = {
  xeroInvoicesStatus: {
    invoices: {
      orderId: string
      status: OrderStatus
    }[]
  }
}

export type InputType = {
  input: {
    orderIds: string[]
    idContains?: string
    statuses?: OrderStatus[]
  }
}

export const QUERY = gql`
  query GetXeroInvoicesStatus($input: XeroInvoicesStatusInput!) {
    xeroInvoicesStatus(input: $input) {
      invoices {
        orderId
        status
      }
    }
  }
`
