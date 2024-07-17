import { gql } from 'graphql-request'

export const XERO_CONNECT_QUERY = gql`
  query XeroConnect {
    xeroConnect {
      consentUrl
    }
  }
`

export type XeroCallbackResp = { xeroCallback: { status: boolean } }

export const XERO_CONNECT_MUTATION = gql`
  mutation XeroCallback($input: XeroCallbackInput!) {
    xeroCallback(input: $input) {
      status
    }
  }
`
