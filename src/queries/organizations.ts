import { gql } from 'graphql-request'

import { ORGANIZATION } from './fragments'

export const getOrganizations = gql`
  ${ORGANIZATION}
  query GetOrganizations($limit: Int = 20, $offset: Int = 0) {
    organizations: organization(
      limit: $limit
      offset: $offset
      order_by: { updatedAt: desc }
    ) {
      ...Organization
      members_aggregate {
        aggregate {
          count
        }
      }
    }
    organization_aggregate {
      aggregate {
        count
      }
    }
  }
`
