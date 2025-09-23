import { gql } from 'graphql-request'

export const QUERY = gql`
  query GetXeroInvoicesStatus($input: XeroInvoicesStatusInput!) {
    xeroInvoicesStatus(input: $input) {
      invoices {
        invoiceNumber
        status
      }
    }
  }
`
