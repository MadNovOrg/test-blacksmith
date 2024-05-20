import { gql } from 'graphql-request'

import { RESOURCE_SUMMARY } from '@app/pages/Resources/queries/resource-summary'

export const GET_RESOURCES_BY_IDS = gql`
  ${RESOURCE_SUMMARY}
  query GetResources($id: ID!, $resourceIds: [ID]!) {
    content {
      resourceCategory(id: $id) {
        resources(
          where: { in: $resourceIds, orderby: { field: SLUG, order: ASC } }
        ) {
          nodes {
            ...ResourceSummary
          }
        }
      }
    }
  }
`
