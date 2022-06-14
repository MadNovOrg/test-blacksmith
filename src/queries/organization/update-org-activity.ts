import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation UpdateOrgActivity($profileId: uuid!) {
    update_organization(
      where: { members: { profile_id: { _eq: $profileId } } }
      _set: { last_activity: "now()" }
    ) {
      returning {
        id
      }
    }
  }
`
