import { gql } from 'urql'

export const GET_PROFILE_MANAGED_ORGS = gql`
  query ProfileManagedOrganizations($profileId: uuid!) {
    organization_member(
      where: { isAdmin: { _eq: true }, profile_id: { _eq: $profileId } }
    ) {
      id
      organization {
        id
        external_dashboard_url
        name
      }
    }
  }
`
