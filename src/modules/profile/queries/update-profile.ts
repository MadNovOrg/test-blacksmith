import { gql } from 'graphql-request'

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input)
  }
`
