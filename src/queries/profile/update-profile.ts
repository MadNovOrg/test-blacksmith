import { gql } from 'graphql-request'

export type ResponseType = { updated: { id: string } }

export type ParamsType = {
  profileId: string
  input: {
    givenName: string
    familyName: string
    phone: string
    dob: Date | null
    jobTitle: string
  }
}

export const MUTATION = gql`
  mutation UpdateProfile($input: profile_set_input = {}, $profileId: uuid!) {
    updated: update_profile_by_pk(
      pk_columns: { id: $profileId }
      _set: $input
    ) {
      id
    }
  }
`
