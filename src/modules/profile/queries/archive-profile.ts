import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation ArchiveProfile($profileId: uuid!) {
    update_profile_by_pk(
      pk_columns: { id: $profileId }
      _set: { archived: true }
    ) {
      id
    }
  }
`
