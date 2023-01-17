import { gql } from 'graphql-request'

export default gql`
  mutation Go1LicensesChange($input: Go1LicensesChangeInput!) {
    go1LicensesChange(input: $input) {
      success
      error
    }
  }
`
