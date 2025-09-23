import { gql } from 'urql'

export const CHECK_USER_EXISTS_BY_EMAIL = gql`
  query CheckIfUserExistsByMail($email: String!) {
    profile_aggregate(where: { email: { _eq: $email } }) {
      aggregate {
        count
      }
    }
  }
`
