import { gql } from 'graphql-request'

import { RoleIds } from '@qa/data/roles'
import {
  CleanupE2EMergeUsersMutation,
  CleanupE2EMergeUsersMutationVariables,
  CreateE2EMergeUsersMutation,
  CreateE2EMergeUsersMutationVariables,
} from '@qa/generated/graphql'

import { getClient } from './client'

export const cleanupMergeUsers = async () => {
  const query = gql`
    mutation CleanupE2EMergeUsers {
      delete_profile(
        where: {
          _or: [
            { _email: { _eq: "merge.e2e1@teamteach.testinator.com" } }
            { _email: { _eq: "merge.e2e2@teamteach.testinator.com" } }
          ]
        }
      ) {
        affected_rows
      }
    }
  `

  const response = await getClient().request<
    CleanupE2EMergeUsersMutation,
    CleanupE2EMergeUsersMutationVariables
  >(query)

  return response.delete_profile?.affected_rows
}

export const MERGE_USER1_EMAIL = 'merge.e2e1@teamteach.testinator.com'
export const MERGE_USER2_EMAIL = 'merge.e2e2@teamteach.testinator.com'

export const createMergeUsers = async () => {
  const query = gql`
    mutation CreateE2EMergeUsers {
      insert_profile(
        objects: [
          {
            _given_name: "Merge"
            _family_name: "E2E 1"
            _email: "${MERGE_USER1_EMAIL}"
            roles: {
              data: [
                { role_id: "${RoleIds.User}" }
                { role_id: "${RoleIds.Trainer}" }
              ]
            }
          },
          {
            _given_name: "Merge"
            _family_name: "E2E 2"
            _email: "${MERGE_USER2_EMAIL}",
            roles: {
              data: [
                { role_id: "${RoleIds.SalesAdmin}" }
              ]
            }
          }
        ]
      ) {
        returning {
          id
        }
      }
    }
  `

  const response = await getClient().request<
    CreateE2EMergeUsersMutation,
    CreateE2EMergeUsersMutationVariables
  >(query)

  return response.insert_profile?.returning ?? []
}
