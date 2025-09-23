import { gql } from 'graphql-request'

export const UPDATE_PROFILE_TRAINER_AGREEMENT_TYPES = gql`
  mutation UpdateTrainerAgreementTypes(
    $profile_id: uuid!
    $trainerAgreementTypes: [profile_trainer_agreement_type_insert_input!]!
  ) {
    __typename # Placeholder value
    delete_profile_trainer_agreement_type(
      where: { profile_id: { _eq: $profile_id } }
    ) {
      affected_rows
    }
    insert_profile_trainer_agreement_type(objects: $trainerAgreementTypes) {
      affected_rows
    }
  }
`
