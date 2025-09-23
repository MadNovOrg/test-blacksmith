import { gql } from 'graphql-request'

import { RESOURCE_CATEGORY_SUMMARY } from './resource-category'

export const RESOURCE_DETAILS_QUERY = gql`
  ${RESOURCE_CATEGORY_SUMMARY}

  query ResourceDetails($id: ID!, $term: String) {
    content {
      resourceCategory(id: $id) {
        ...ResourceCategorySummary
        children(first: 100) {
          nodes {
            ...ResourceCategorySummary
            children(first: 100) {
              nodes {
                ...ResourceCategorySummary
              }
            }
          }
        }
      }
    }
  }
`
