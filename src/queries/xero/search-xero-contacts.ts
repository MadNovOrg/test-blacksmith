import { gql } from 'graphql-request'

export const QUERY = gql`
  query SearchXeroContacts($input: XeroContactSearchInput!) {
    xero: xeroContactSearch(input: $input) {
      contacts {
        name
        contactID
      }
    }
  }
`
