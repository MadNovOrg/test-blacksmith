import { gql } from 'graphql-request'

export const ALL_RESOURCE_CATEGORIES_QUERY = gql`
  query AllResourceCategories {
    content {
      resourceCategories {
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
        }
      }
    }
  }
`
