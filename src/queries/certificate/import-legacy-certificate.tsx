import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation ImportLegacyCertificate($code: String!) {
    importLegacyCertificate(code: $code)
  }
`
