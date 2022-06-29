import { isValid } from 'date-fns'
import { useMemo } from 'react'
import useSWR from 'swr'

import { Promo_Code_Type_Enum } from '@app/generated/graphql'
import {
  QUERY,
  ResponseType,
  InputType,
} from '@app/queries/promo-codes/get-promo-codes'
import { SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type UsePromoCodesProps = {
  sort: { by: string; dir: SortOrder }
  filters: { from?: Date; to?: Date; type?: string[] }
  limit: number
  offset: number
}

export const usePromoCodes = ({
  sort,
  filters,
  limit,
  offset,
}: UsePromoCodesProps) => {
  const dateWhere = useMemo(() => {
    if (!filters.from && !filters.to) return

    const from = isValid(filters.from) ? filters.from : undefined
    from && from.setHours(0, 0, 0)

    const to = isValid(filters.to) ? filters.to : undefined
    to && to.setHours(23, 59, 59)

    return { createdAt: { _gte: from, _lte: to } }
  }, [filters.from, filters.to])

  const typeWhere = useMemo(() => {
    const types = filters.type as Promo_Code_Type_Enum[]
    return types && types.length ? { type: { _in: types } } : {}
  }, [filters.type])

  const { data, error } = useSWR<ResponseType, Error, [string, InputType]>([
    QUERY,
    {
      orderBy: sort.by ? { [sort.by]: sort.dir } : undefined,
      where: { ...dateWhere, ...typeWhere },
      limit,
      offset,
    },
  ])

  const status = getSWRLoadingStatus(data, error)

  return {
    promoCodes: data?.promoCodes ?? [],
    total: data?.promo_code_aggregate.aggregate.count ?? 0,
    error,
    status,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
