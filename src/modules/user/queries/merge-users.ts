import { gql } from 'graphql-request'

export const MERGE_USERS_MUTATION = gql`
  mutation MergeUser($primaryUser: uuid!, $mergeWith: uuid!) {
    mergeUser(primaryUser: $primaryUser, mergeWith: $mergeWith) {
      success
      error
    }
  }
`
