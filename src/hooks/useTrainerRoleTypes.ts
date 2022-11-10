import useSWR from 'swr'

import {
  GetTrainerRoleTypesQuery,
  GetTrainerRoleTypesQueryVariables,
} from '@app/generated/graphql'
import { GetTrainerRoleTypes } from '@app/queries/trainer/get-trainer-role-type'
import { getSWRLoadingStatus } from '@app/util'

export default function useTrainerRoleTypes() {
  const { data, error } = useSWR<
    GetTrainerRoleTypesQuery,
    Error,
    [string, GetTrainerRoleTypesQueryVariables] | null
  >([GetTrainerRoleTypes, {}])

  return {
    trainerRoleTypes: data?.trainer_role_type,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
