import { useMemo } from 'react'
import useSWR from 'swr'

import {
  ParamsType,
  QUERY,
  ResponseType,
} from '@app/queries/organization/get-organizations'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { Sorting } from './useTableSort'

export const useOrganizations = (
  sorting?: Sorting,
  where?: Record<string, unknown>
) => {
  const orderBy = sorting ? { [sorting.by]: sorting.dir } : undefined

  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType] | null
  >([QUERY, { orderBy, where }], { focusThrottleInterval: 2000 })

  const status = getSWRLoadingStatus(data, error)

  return useMemo(
    () => ({
      orgs: data?.orgs ?? [],
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      mutate,
    }),
    [data, error, status, mutate]
  )
}
