import { gql } from 'graphql-request'

export const UPDATE_PROFILE_TRAINER_ROLE_TYPES = gql`
  mutation UpdateTrainerRoleType(
    $id: uuid!
    $trainerRoleTypes: [profile_trainer_role_type_insert_input!]!
  ) {
    delete_profile_trainer_role_type(where: { profile_id: { _eq: $id } }) {
      affected_rows
    }
    insert_profile_trainer_role_type(objects: $trainerRoleTypes) {
      affected_rows
    }
  }
`
