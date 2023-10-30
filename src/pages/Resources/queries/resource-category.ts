import { gql } from 'graphql-request'

import { RESOURCE_SUMMARY } from './resource-summary'

export const RESOURCE_CATEGORY_SUMMARY = gql`
  ${RESOURCE_SUMMARY}

  fragment ResourceCategorySummary on ResourceCategory {
    id
    name
    description
    resourcePermissions {
      certificateLevels
      principalTrainer
    }
    resources(
      first: 100
      where: { search: $term, orderby: { field: SLUG, order: ASC } }
    ) {
      nodes {
        ...ResourceSummary
      }
    }
  }
`
