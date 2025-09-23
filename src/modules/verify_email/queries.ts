import { gql } from 'urql'

export const REMOVE_UNVERIFIED_ROLE = gql`
  mutation RemoveUnverifiedRole($profileId: uuid!) {
    delete_profile_role(
      where: {
        profile_id: { _eq: $profileId }
        role: { name: { _eq: "unverified" } }
      }
    ) {
      affected_rows
    }
  }
`
