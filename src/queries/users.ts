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
      managedOrgIds: organizations(where: { isAdmin: { _eq: true } }) {
        organization_id
      }
      trainerRoles: trainer_role_types {
        trainer_role_type {
          name
        }
      }
      certificates(where: { status: { _eq: "ACTIVE" } }) {
        courseLevel
      }
    }
  }
`
