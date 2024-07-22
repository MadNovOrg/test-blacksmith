import { gql } from 'urql'

export const GET_ORG_BY_ID = gql`
  query GetOrgById($id: uuid!) {
    organization(where: { id: { _eq: $id } }) {
      address
      name
      id
    }
  }
`
