import { gql } from 'graphql-request'

export const SEARCH_XERO_CONTACTS = gql`
  query SearchXeroContacts($input: XeroContactSearchInput!) {
    xero: xeroContactSearch(input: $input) {
      contacts {
        name
        contactID
      }
    }
  }
`
