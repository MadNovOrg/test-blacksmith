import { gql } from 'graphql-request'

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
