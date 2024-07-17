import { gql } from 'graphql-request'

export type ArloCallbackResp = { arloCallback: { status: boolean } }

export const ARLO_CONNECT_MUTATION = gql`
  mutation ArloCallback($input: ArloCallbackInput!) {
    arloCallback(input: $input) {
      status
    }
  }
`

export function arrayBufferToBinaryString(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return binary
}
