import { gql } from 'urql'

export const Query = gql`
  query GetCountries {
    countries: country(order_by: { name: asc }) {
      name
    }
  }
`
