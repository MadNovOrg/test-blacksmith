import { gql } from 'urql'

export const GET_DFE_REGISTERED_ORGANISATION = gql`
  query GetDfeRegisteredOrganisation($name: String!, $postcode: String!) {
    dfe_establishment(
      where: { _and: [{ name: { _eq: $name }, postcode: { _eq: $postcode } }] }
    ) {
      registered
      organizations {
        id
      }
    }
  }
`
