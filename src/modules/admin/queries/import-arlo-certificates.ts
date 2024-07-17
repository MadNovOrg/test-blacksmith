import { gql } from 'urql'

export const IMPORT_ARLO_CERTIFICATES_ACTION = gql`
  mutation ImportArloCertificates($report: String!) {
    importArloCertificates(report: $report)
  }
`

export const IMPORT_ARLO_CERTIFICATES_ACTION_RESULT = gql`
  query ImportArloCertificatesResult($id: uuid!) {
    importArloCertificates(id: $id) {
      output {
        processed
        added
        invalid
        error
        invalidEntries {
          email
        }
      }
    }
  }
`
