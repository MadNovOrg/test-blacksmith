import { gql } from 'graphql-request'

export type ArloCallbackResp = { arloCallback: { status: boolean } }

export const ArloCallbackQuery = gql`
  mutation ArloCallback($input: ArloCallbackInput!) {
    arloCallback(input: $input) {
      status
    }
  }
`
