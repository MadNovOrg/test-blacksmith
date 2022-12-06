import { gql } from 'graphql-request'

export const RESOURCE_SUMMARY = gql`
  fragment ResourceSummary on Resource {
    id
    title
    resourceType {
      resourcetype
    }
    downloads {
      file {
        mediaItemUrl
      }
    }
  }
`
