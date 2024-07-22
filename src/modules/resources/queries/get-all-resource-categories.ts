import { gql } from 'graphql-request'

export const ALL_RESOURCE_CATEGORIES_QUERY = gql`
  query AllResourceCategories {
    content {
      resourceCategories(first: 100) {
        nodes {
          id
          name
          description
          resouceIcon {
            resourceicon
          }
          resourceArea {
            resourcearea
          }
          resourcePermissions {
            certificateLevels
            principalTrainer
            courseInProgress
            seniorTrainer
            etaTrainer
          }
        }
      }
    }
  }
`
