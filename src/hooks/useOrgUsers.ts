import { useMemo } from 'react'
import useSWR from 'swr'

import { Sorting } from '@app/hooks/useTableSort'
import {
  ParamsType as GetOrgUsersParamsType,
  QUERY as GET_ORG_USERS_QUERY,
  ResponseType as GetOrgUsersResponseType,
} from '@app/queries/organization/get-org-users'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

type Props = {
  sorting: Sorting
  limit?: number
  offset?: number
}

export const useOrgUsers = (
  orgId: string,
  { sorting, limit, offset }: Props
) => {
  const orderBy = getOrderBy(sorting)

  const { data, error, mutate } = useSWR<
    GetOrgUsersResponseType,
    Error,
    [string, GetOrgUsersParamsType] | null
  >(orgId ? [GET_ORG_USERS_QUERY, { orgId, limit, offset, orderBy }] : null)

  const status = getSWRLoadingStatus(data, error)

  return useMemo(
    () => ({
      users: data?.users ?? [],
      totalCount: data?.total.aggregate.count,
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      mutate,
    }),
    [data, error, status, mutate]
  )
}

function getOrderBy({ by, dir }: Pick<Sorting, 'by' | 'dir'>) {
  switch (by) {
    case 'fullName':
    case 'createdAt':
    case 'lastActivity':
      return { profile: { [by]: dir } }

    case 'permissions':
      return { isAdmin: dir }
  }
}
