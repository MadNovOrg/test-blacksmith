import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation MergeUser($primaryUser: uuid!, $mergeWith: uuid!) {
    mergeUser(primaryUser: $primaryUser, mergeWith: $mergeWith) {
      success
      error
    }
  }
`
