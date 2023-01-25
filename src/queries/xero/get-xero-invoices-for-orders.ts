import { gql } from 'urql'

import { XeroInvoice as XeroInvoiceSummary } from '@app/queries/fragments'

export const QUERY = gql`
  ${XeroInvoiceSummary}

  query GetXeroInvoicesForOrders($invoiceNumbers: [String!]!) {
    invoices: getXeroInvoicesForOrders(invoiceNumbers: $invoiceNumbers) {
      ...XeroInvoiceSummary
    }
  }
`
