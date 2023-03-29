import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation DeleteProfile($profileId: uuid!) {
    deleteUser(profileId: $profileId) {
      success
      error
      courseIds
    }
  }
`
