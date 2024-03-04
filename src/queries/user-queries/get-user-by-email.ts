import { gql } from 'graphql-request'

export const GET_USER_BY_EMAIL = gql`
  query GetUserByMail($email: [String!]) {
    profile(where: { email: { _in: $email } }) {
      id
      email
    }
  }
`

export const CHECK_USER_EXISTS_BY_EMAIL = gql`
  query CheckIfUserExistsByMail($email: String!) {
    profile_aggregate(where: { email: { _eq: $email } }) {
      aggregate {
        count
      }
    }
  }
`
