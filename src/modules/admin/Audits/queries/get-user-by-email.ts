import { gql } from 'graphql-request'

export const GET_USER_BY_EMAIL = gql`
  query GetUserByMail($email: [String!]) {
    profile(where: { email: { _in: $email } }) {
      id
      email
    }
  }
`
