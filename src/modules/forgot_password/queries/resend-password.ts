import { gql } from 'graphql-request'

export const RESEND_PASSWORD_MUTATION = gql`
  mutation ResendPassword($email: String!) {
    resendPassword(email: $email)
  }
`
