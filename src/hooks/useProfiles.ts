import useSWR from 'swr'

import {
  GetProfilesQuery,
  GetProfilesQueryVariables,
  Order_By,
  Profile_Bool_Exp,
  Profile_Order_By,
} from '@app/generated/graphql'
import { getProfiles } from '@app/queries/profile/get-profiles'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { Sorting } from './useTableSort'

export type UseProfileProps = {
  sorting: Sorting
  limit: number
  offset: number
  where: Profile_Bool_Exp
}

export default function useProfiles({
  sorting,
  where,
  limit,
  offset,
}: UseProfileProps) {
  const orderBy = getOrderBy(sorting)

  const { data, error, mutate } = useSWR<
    GetProfilesQuery,
    Error,
    [string, GetProfilesQueryVariables] | null
  >([getProfiles, { where, orderBy, limit, offset }])

  const status = getSWRLoadingStatus(data, error)

  return {
    mutate,
    profiles: data?.profiles ?? [],
    count: data?.profile_aggregate.aggregate?.count,
    error,
    isLoading: status === LoadingStatus.FETCHING,
  }
}

export function getOrderBy({
  by,
  dir,
}: Pick<Sorting, 'by' | 'dir'>): Profile_Order_By {
  switch (by) {
    case 'fullName':
    case 'email':
      return { [by]: dir }

    default: {
      return { fullName: Order_By.Asc }
    }
  }
}
