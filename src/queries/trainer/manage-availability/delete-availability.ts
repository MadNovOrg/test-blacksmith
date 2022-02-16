import { gql } from 'graphql-request'

export type ResponseType = { id: string }

export type ParamsType = { id: string }

export const MUTATION = gql`
  mutation deleteAvailability($id: uuid!) {
    delete_availability_by_pk(id: $id) {
      id
    }
  }
`
