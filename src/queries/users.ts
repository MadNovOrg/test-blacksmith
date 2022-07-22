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
      adminRights: organizations_aggregate(where: { isAdmin: { _eq: true } }) {
        aggregate {
          count
        }
      }
    }
  }
`

export const getProfileWithCriteria = gql`
  ${PROFILE}
  query GetProfileWithCriteria(
    $limit: Int = 20
    $offset: Int = 0
    $where: profile_bool_exp
  ) {
    profiles: profile(limit: $limit, offset: $offset, where: $where) {
      ...Profile
    }
    profile_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
