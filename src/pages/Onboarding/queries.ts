import { gql } from 'urql'

export const ONBOARD_USER = gql`
  mutation OnboardUser($id: uuid!, $input: profile_set_input!) {
    update_profile_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
    }
  }
`
