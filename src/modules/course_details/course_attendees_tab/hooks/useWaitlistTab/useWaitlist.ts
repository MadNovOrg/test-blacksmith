import { useMemo } from 'react'
import { useQuery, gql } from 'urql'

import {
  GetWaitlistQuery,
  GetWaitlistQueryVariables,
} from '@app/generated/graphql'
import { Waitlist as WaitlistSummary } from '@app/queries/fragments'
import { SortOrder } from '@app/types'

export const QUERY = gql`
  ${WaitlistSummary}

  query GetWaitlist(
    $where: waitlist_bool_exp!
    $limit: Int = 20
    $offset: Int = 0
    $orderBy: [waitlist_order_by!]
  ) {
    waitlist(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      ...WaitlistSummary
    }

    waitlistAggregate: waitlist_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export type UseWaitlistProps = {
  courseId: number
  sort: { by: string; dir: SortOrder }
  limit?: number
  offset?: number
}

export const useWaitlist = ({
  courseId,
  sort,
  limit,
  offset,
}: UseWaitlistProps) => {
  const orderBy: GetWaitlistQueryVariables['orderBy'] = useMemo(
    () => (sort.by ? { [sort.by]: sort.dir } : undefined),
    [sort],
  )

  const where: GetWaitlistQueryVariables['where'] = useMemo(
    () => ({
      courseId: { _eq: courseId },
    }),
    [courseId],
  )

  const [{ data, error, fetching }, mutate] = useQuery<
    GetWaitlistQuery,
    GetWaitlistQueryVariables
  >({
    query: QUERY,
    variables: { where, orderBy, limit, offset },
    requestPolicy: 'cache-and-network',
  })

  return useMemo(
    () => ({
      data: data?.waitlist ?? [],
      total: data?.waitlistAggregate?.aggregate?.count ?? 0,
      isLoading: fetching,
      error,
      mutate,
    }),
    [
      data?.waitlist,
      data?.waitlistAggregate?.aggregate?.count,
      error,
      fetching,
      mutate,
    ],
  )
}
