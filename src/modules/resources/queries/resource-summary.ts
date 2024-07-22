import { gql } from 'graphql-request'

export const RESOURCE_SUMMARY = gql`
  fragment ResourceSummary on Resource {
    id
    title
    resourceAttachment {
      resourcetype
      videourl
      file {
        mediaItemUrl
      }
      link {
        url
      }
    }
    resourcePermissions {
      certificateLevels
      principalTrainer
      courseInProgress
      seniorTrainer
      etaTrainer
    }
  }
`
