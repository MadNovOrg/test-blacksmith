import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation UpdateAvatar($avatar: bytea!) {
    updateAvatar(avatar: $avatar) {
      avatar
    }
  }
`
