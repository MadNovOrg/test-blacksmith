import { isValid } from 'date-fns'
import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Promo_Code_Bool_Exp,
  Promo_Code_Type_Enum,
} from '@app/generated/graphql'
import {
  InputType,
  QUERY,
  ResponseType,
} from '@app/queries/promo-codes/get-promo-codes'
import { PromoCodeStatus, SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type UsePromoCodesProps = {
  sort: { by: string; dir: SortOrder }
  filters: {
    from?: Date
    to?: Date
    type?: string[]
    code?: string | string[]
    status?: string[]
  }
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

  const codeWhere = useMemo(() => {
    if (filters.code && typeof filters.code === 'string') {
      const query = (filters.code ?? '').trim()
      return query.length ? { code: { _ilike: `%${query}%` } } : {}
    } else if (
      filters.code &&
      typeof filters.code === 'object' &&
      filters.code.length > 0
    ) {
      return { code: { _in: filters.code } }
    }
  }, [filters.code])

  const statusWhere = useMemo(() => {
    const query: Promo_Code_Bool_Exp = {}
    if (!filters.status?.length) {
      return query
    }

    query._or = []
    filters.status.forEach(s => {
      const q: Promo_Code_Bool_Exp = {}
      switch (s as PromoCodeStatus) {
        case PromoCodeStatus.ACTIVE:
          q._or = [
            {
              _or: [
                {
                  amount: { _lt: 15 },
                  type: { _eq: Promo_Code_Type_Enum.Percent },
                },
                {
                  amount: { _lte: 3 },
                  type: { _eq: Promo_Code_Type_Enum.FreePlaces },
                },
              ],
            },
            {
              approvedBy: { _is_null: false },
            },
          ]

          q.deniedBy = { _is_null: true }
          q.validFrom = { _lte: new Date().toISOString() }
          q._and = [
            {
              _or: [
                {
                  validTo: { _gte: new Date().toISOString() },
                },
                {
                  validTo: { _is_null: true },
                },
              ],
            },
          ]
          break

        case PromoCodeStatus.DENIED:
          q.deniedBy = { _is_null: false }
          break

        case PromoCodeStatus.APPROVAL_PENDING:
          q.approvedBy = { _is_null: true }
          q._or = [
            {
              amount: { _gte: 15 },
              type: { _eq: Promo_Code_Type_Enum.Percent },
            },
            {
              amount: { _gt: 3 },
              type: { _eq: Promo_Code_Type_Enum.FreePlaces },
            },
          ]
          q.deniedBy = { _is_null: true }
          break

        case PromoCodeStatus.SCHEDULED:
          q._or = [
            {
              approvedBy: { _is_null: true },
              _or: [
                {
                  amount: { _lt: 15 },
                  type: { _eq: Promo_Code_Type_Enum.Percent },
                },
                {
                  amount: { _lte: 3 },
                  type: { _eq: Promo_Code_Type_Enum.FreePlaces },
                },
              ],
            },
            {
              approvedBy: { _is_null: false },
            },
          ]

          q.deniedBy = { _is_null: true }
          q.validFrom = { _gt: new Date().toISOString() }
          break

        case PromoCodeStatus.EXPIRED:
          q._or = [
            {
              approvedBy: { _is_null: true },
              _or: [
                {
                  amount: { _lt: 15 },
                  type: { _eq: Promo_Code_Type_Enum.Percent },
                },
                {
                  amount: { _lte: 3 },
                  type: { _eq: Promo_Code_Type_Enum.FreePlaces },
                },
              ],
            },
            {
              approvedBy: { _is_null: false },
            },
          ]

          q.deniedBy = { _is_null: true }
          q.validFrom = { _lte: new Date().toISOString() }
          q.validTo = {
            _is_null: false,
            _lt: new Date().toISOString(),
          }
          break

        case PromoCodeStatus.DISABLED:
          q.disabled = { _eq: true }
          break

        default:
          break
      }

      query._or?.push(q)
    })

    return query
  }, [filters.status])

  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, InputType]
  >([
    QUERY,
    {
      orderBy: sort.by ? { [sort.by]: sort.dir } : undefined,
      where: { ...dateWhere, ...typeWhere, ...codeWhere, ...statusWhere },
      limit,
      offset,
    },
  ])

  const status = getSWRLoadingStatus(data, error)

  return {
    promoCodes: data?.promoCodes ?? [],
    total: data?.promo_code_aggregate.aggregate?.count ?? 0,
    error,
    status,
    mutate,
    isLoading: status === LoadingStatus.FETCHING,
  }
}
