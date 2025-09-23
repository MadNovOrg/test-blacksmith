import { gql } from 'graphql-request'
import { useQuery } from 'urql'

import { GetTrainerAgreementTypesQuery } from '@app/generated/graphql'

export const GET_TRAINER_AGREEMENT_TYPES = gql`
  query GetTrainerAgreementTypes {
    trainer_agreement_type {
      name
    }
  }
`

export default function useTrainerAgreementTypes() {
  const [{ data, error, fetching }] = useQuery<GetTrainerAgreementTypesQuery>({
    query: GET_TRAINER_AGREEMENT_TYPES,
  })

  return {
    trainerAgreementTypes: data?.trainer_agreement_type,
    error,
    fetching,
  }
}
