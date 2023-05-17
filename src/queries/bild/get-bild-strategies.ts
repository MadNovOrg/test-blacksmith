import { gql } from 'urql'

export const QUERY = gql`
  query GetBildStrategies {
    strategies: bild_strategy {
      id
      name
      shortName
      modules
      duration
    }
  }
`
