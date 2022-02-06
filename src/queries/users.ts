import { gql } from 'graphql-request'

import { PROFILE } from './fragments'

export const getProfiles = gql`
  ${PROFILE}
  query GetProfile {
    profile {
      ...Profile
    }
  }
`

export const getUserProfile = gql`
  ${PROFILE}
  query GetProfileById($id: uuid!) {
    profile: profile_by_pk(id: $id) {
      ...Profile
    }
  }
`
