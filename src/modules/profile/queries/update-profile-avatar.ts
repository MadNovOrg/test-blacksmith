import { gql } from 'graphql-request'

export const UPDATE_AVATAR_MUTATION = gql`
  mutation UpdateAvatar($avatar: bytea!, $profileId: uuid!) {
    updateAvatar(avatar: $avatar, profileId: $profileId) {
      avatar
    }
  }
`
