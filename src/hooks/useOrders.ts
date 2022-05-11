import { isValid } from 'date-fns'
import { useMemo } from 'react'
import useSWR from 'swr'

import { QUERY, ResponseType, InputType } from '@app/queries/order/get-orders'
import { SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type UseOrdersProps = {
  sort: { by: string; dir: SortOrder }
  filters: { from?: Date; to?: Date }
}

export const useOrders = ({ sort, filters }: UseOrdersProps) => {
  const dateWhere = useMemo(() => {
    if (!filters.from && !filters.to) return

    const from = isValid(filters.from) ? filters.from : undefined
    from && from.setHours(0, 0, 0)

    const to = isValid(filters.to) ? filters.to : undefined
    to && to.setHours(23, 59, 59)

    return { createdAt: { _gte: from, _lte: to } }
  }, [filters.from, filters.to])

  const { data, error } = useSWR<ResponseType, Error, [string, InputType]>([
    QUERY,
    {
      orderBy: sort.by ? { [sort.by]: sort.dir } : undefined,
      where: { ...dateWhere },
    },
  ])

  const status = getSWRLoadingStatus(data, error)

  return {
    orders: data?.orders ?? [],
    error,
    status,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
