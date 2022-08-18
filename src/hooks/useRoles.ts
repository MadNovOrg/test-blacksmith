import useSWR from 'swr'

import { GetRolesQuery, GetRolesQueryVariables } from '@app/generated/graphql'
import { getRoles } from '@app/queries/users'
import { getSWRLoadingStatus } from '@app/util'

export default function useRoles() {
  const { data, error } = useSWR<
    GetRolesQuery,
    Error,
    [string, GetRolesQueryVariables] | null
  >([getRoles, {}])

  return {
    roles: data?.role,
    error,
    status: getSWRLoadingStatus(data, error),
  }
}
