import { gql } from 'urql'

export const QUERY = gql`
  query GetBildStrategies {
    strategies: bild_strategy(order_by: { sort: asc }) {
      id
      name
      shortName
      modules
      duration
    }
  }
`
