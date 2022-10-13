import { gql } from 'graphql-request'

import { PROFILE } from './fragments'

export const getRoles = gql`
  query GetRoles {
    role {
      id
      name
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
