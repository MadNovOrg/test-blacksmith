import { gql } from 'urql'

export const GET_ORGANISATION_DETAILS_FOR_DELETE = gql`
  query GetOrganisationDetailsForDelete($orgId: uuid!) {
    orgs: organization_by_pk(id: $orgId) {
      members: members_aggregate {
        aggregate {
          count
        }
      }
      courses: organization_courses_aggregate {
        aggregate {
          count
        }
      }
      orders: organization_orders_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
