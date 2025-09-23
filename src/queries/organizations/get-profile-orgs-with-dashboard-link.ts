import { gql } from 'urql'

export const GET_PROFILE_ORGS_WITH_DASHBOARD_LINK = gql`
  query GetProfileOrgsWithDashboardLink($profileId: uuid!) {
    organization_member(where: { profile_id: { _eq: $profileId } }) {
      id
      organization {
        id
        external_dashboard_url
        name
      }
    }
  }
`
