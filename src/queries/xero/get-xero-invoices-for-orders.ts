import { gql } from 'graphql-request'

import { XeroInvoice as XeroInvoiceSummary } from '@app/queries/fragments'

export const QUERY = gql`
  ${XeroInvoiceSummary}

  query GetXeroInvoicesForOrders($orderIds: [uuid!]!) {
    invoices: getXeroInvoicesForOrders(orderIds: $orderIds) {
      ...XeroInvoiceSummary
    }
  }
`
