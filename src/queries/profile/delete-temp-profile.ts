import { gql } from 'graphql-request'

export type ParamsType = { email: string }

export type ResponseType = { deleted: { affectedRows: number } }

export const MUTATION = gql`
  mutation DeleteTempProfile($email: String!) {
    deleted: delete_profile_temp(where: { email: { _eq: $email } }) {
      affectedRows: affected_rows
    }
  }
`
