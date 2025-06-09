import { gql } from 'graphql-request'

import { Certificate_Status_Enum } from '@app/generated/graphql'
import { PROFILE } from '@app/queries/fragments'

export const GET_USER_PROFILE = gql`
  ${PROFILE}
  query GetProfileById($id: uuid!) {
    profile: profile_by_pk(id: $id) {
      ...Profile
      managedOrgIds: organizations(where: { isAdmin: { _eq: true } }) {
        organization_id
        organization {
          affiliated_organisations {
            id
          }
        }
      }
      trainerRoles: trainer_role_types {
        trainer_role_type {
          name
        }
      }
      certificates(where: { status: { _nin: [${Certificate_Status_Enum.OnHold}, ${Certificate_Status_Enum.Revoked}, ${Certificate_Status_Enum.Expired}] } }) {
        courseLevel
        expiryDate
        grade
        isRevoked
      }
      courses {
        grade
        course {
          level
          start: schedule_aggregate {
            aggregate {
              date: max {
                start
              }
            }
          }
          end: schedule_aggregate {
            aggregate {
              date: max {
                end
              }
            }
          }
        }
      }
    }
  }
`
