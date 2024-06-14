import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation DeleteProfile($profileId: uuid!, $dryRun: Boolean) {
    deleteUser(profileId: $profileId, dryRun: $dryRun) {
      success
      error
      courseIds
    }
  }
`
