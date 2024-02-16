import { useQuery, gql } from 'urql'

import { GetTrainerRoleTypesQuery } from '@app/generated/graphql'

export const GET_TRAINER_ROLE_TYPES = gql`
  query GetTrainerRoleTypes {
    trainer_role_type {
      id
      name
    }
  }
`

export default function useTrainerRoleTypes() {
  const [{ data, error, fetching }] = useQuery<GetTrainerRoleTypesQuery>({
    query: GET_TRAINER_ROLE_TYPES,
  })

  return {
    trainerRoleTypes: data?.trainer_role_type,
    error,
    fetching,
  }
}
