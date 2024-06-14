import { gql } from 'urql'

export const MUTATION = gql`
  mutation DeleteTempProfile($email: String!) {
    deleted: delete_profile_temp(where: { email: { _eq: $email } }) {
      affectedRows: affected_rows
    }
  }
`
