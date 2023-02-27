import useSWR from 'swr'

import {
  GetProfilesQuery,
  GetProfilesQueryVariables,
} from '@app/generated/graphql'
import { getProfiles } from '@app/queries/profile/get-profiles'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export default function useProfiles({
  where,
  limit,
  offset,
}: GetProfilesQueryVariables) {
  const { data, error, mutate } = useSWR<
    GetProfilesQuery,
    Error,
    [string, GetProfilesQueryVariables] | null
  >([getProfiles, { where, limit, offset }])

  const status = getSWRLoadingStatus(data, error)

  return {
    mutate,
    profiles: data?.profiles ?? [],
    count: data?.profile_aggregate.aggregate?.count,
    error,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
