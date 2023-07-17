import { gql } from 'graphql-request'

export const IMPORT_ARLO_CERTIFICATE_MUTATION = gql`
  mutation ImportArloCertificates($report: String!) {
    importArloCertificates(report: $report) {
      processed
      added
    }
  }
`
