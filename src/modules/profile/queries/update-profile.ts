import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input)
  }
`
