import { gql } from 'graphql-request'

import { RESOURCE_SUMMARY } from './resource-summary'

export const RESOURCE_CATEGORY_SUMMARY = gql`
  ${RESOURCE_SUMMARY}

  fragment ResourceCategorySummary on ResourceCategory {
    id
    name
    description
    resources(where: { search: $term, orderby: { field: SLUG, order: ASC } }) {
      nodes {
        ...ResourceSummary
      }
    }
  }
`
