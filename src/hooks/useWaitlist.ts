import { useMemo } from 'react'
import useSWR, { KeyedMutator } from 'swr'

import {
  GetWaitlistQuery,
  GetWaitlistQueryVariables,
} from '@app/generated/graphql'
import { QUERY } from '@app/queries/booking/get-waitlist'
import { SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type UseWaitlistProps = {
  courseId: number
  sort: { by: string; dir: SortOrder }
  limit?: number
  offset?: number
  mutate?: KeyedMutator<unknown>
}

export const useWaitlist = ({
  courseId,
  sort,
  limit,
  offset,
}: UseWaitlistProps) => {
  const orderBy: GetWaitlistQueryVariables['orderBy'] = useMemo(
    () => (sort.by ? { [sort.by]: sort.dir } : undefined),
    [sort]
  )

  const where: GetWaitlistQueryVariables['where'] = useMemo(
    () => ({
      courseId: { _eq: courseId },
    }),
    [courseId]
  )

  const { data, error, mutate } = useSWR<
    GetWaitlistQuery,
    Error,
    [string, GetWaitlistQueryVariables]
  >([QUERY, { where, orderBy, limit, offset }])

  return useMemo(
    () => ({
      data: data?.waitlist ?? [],
      total: data?.waitlistAggregate?.aggregate?.count ?? 0,
      isLoading: getSWRLoadingStatus(data, error) === LoadingStatus.FETCHING,
      error,
      mutate,
    }),
    [data, error, mutate]
  )
}
