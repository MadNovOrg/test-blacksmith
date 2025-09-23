import { gql } from 'graphql-request'

import { RESOURCE_SUMMARY } from './resource-summary'

export const RESOURCE_CATEGORY_SUMMARY = gql`
  ${RESOURCE_SUMMARY}

  fragment ResourceCategorySummary on ResourceCategory {
    id
    name
    description
    resourcePermissions {
      allowAccessDayBeforeCourseStart
      certificateLevels
      courseInProgress
      etaTrainer
      principalTrainer
      seniorTrainer
    }
    resources(first: 100, where: { orderby: { field: SLUG, order: ASC } }) {
      nodes {
        ...ResourceSummary
      }
    }
  }
`
