import { gql } from 'graphql-request'

export type XeroConnectResp = { xeroConnect: { consentUrl?: string } }

export const XeroConnectQuery = gql`
  query XeroConnect {
    xeroConnect {
      consentUrl
    }
  }
`

export type XeroCallbackResp = { status: boolean }

export const XeroCallbackQuery = gql`
  mutation XeroCallback($input: XeroCallbackInput!) {
    xeroCallback(input: $input) {
      status
    }
  }
`
