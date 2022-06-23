import { gql } from 'graphql-request'

export type ResponseType = {
  xero: {
    contacts: {
      name: string
      contactID: string
    }[]
  }
}

export type ParamsType = { input: { searchTerm: string } }

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
