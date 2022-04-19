import { gql } from 'graphql-request'

export type ResponseType = { org: { id: string } }

export type ParamsType = {
  name: string
}

export const MUTATION = gql`
  mutation InsertOrg($name: String!) {
    org: insert_organization_one(object: { name: $name }) {
      id
    }
  }
`
