import { gql } from 'graphql-request'

export type ArloCallbackResp = { arloCallback: { status: boolean } }

export const ARLO_CONNECT_MUTATION = gql`
  mutation ArloCallback($input: ArloCallbackInput!) {
    arloCallback(input: $input) {
      status
    }
  }
`
