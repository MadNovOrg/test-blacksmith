import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Currency,
  GetOrdersInput,
  GetOrdersQuery,
  GetOrdersQueryVariables,
  OrderInfo,
  Order_By,
  Order_Order_By,
  Payment_Methods_Enum,
  XeroInvoiceStatus,
} from '@app/generated/graphql'
import { GET_ORDERS } from '@app/pages/tt-pages/Orders/query'
import { SortOrder } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type FiltersType = {
  currencies?: Currency[]
  paymentMethods?: Payment_Methods_Enum[]
  searchParam?: string
  statuses?: XeroInvoiceStatus[]
}

export type UseOrdersProps = {
  sort: { by: string; dir: SortOrder }
  filters: FiltersType
  limit?: number
  offset?: number
}

type GenericOrderType = {
  [key: string]: string | GenericOrderType
}

const isFilterValid = (filter?: FiltersType[keyof FiltersType] | string) =>
  filter && filter.length && filter.length > 0

export const useOrders = ({ sort, filters, limit, offset }: UseOrdersProps) => {
  const getOrdersWhere = useMemo(() => {
    const where: GetOrdersInput['where'] = {}

    if (isFilterValid(filters.currencies)) {
      where.currency = { _in: filters.currencies }
    }

    if (isFilterValid(filters.paymentMethods)) {
      where.paymentMethod = { _in: filters.paymentMethods }
    }

    if (isFilterValid(filters.searchParam)) {
      where._or = []
      where._or.push({
        course: { name: { _ilike: `%${filters.searchParam}%` } },
      })
      where._or.push({
        course: { course_code: { _ilike: `%${filters.searchParam}%` } },
      })
      where._or.push({
        organization: { name: { _ilike: `%${filters.searchParam}%` } },
      })
      where._or.push({
        xeroInvoiceNumber: { _ilike: `%${filters.searchParam}%` },
      })

      const onlyDigits = /^\d+$/.test(filters.searchParam || '')

      if (onlyDigits) {
        where._or.push({ orderDue: { _eq: filters.searchParam } })
        where._or.push({ orderTotal: { _eq: filters.searchParam } })
      }
    }

    return where
  }, [filters])

  const getOrdersOrderBy = useMemo(() => {
    const orderBy: Order_Order_By = {}

    const parts = sort.by.split('.')

    if (parts.length >= 1) {
      const tmp: GenericOrderType = {}

      tmp[parts[parts.length - 1]] =
        sort.dir === 'desc' ? Order_By.Desc : Order_By.Asc

      for (let i = parts.length - 1; i > 0; --i) {
        const key = parts[i]
        const outerKey = parts[i - 1]
        const val = tmp[key]

        delete tmp[key]
        tmp[outerKey] = { [key]: val }
      }

      Object.assign(orderBy, tmp)
    }

    return orderBy
  }, [sort])

  const { data: getOrdersData, error: getOrdersError } = useSWR<
    GetOrdersQuery,
    Error,
    [string, GetOrdersQueryVariables]
  >([
    GET_ORDERS,
    {
      input: {
        orderBy: [getOrdersOrderBy],
        where: getOrdersWhere,
        limit: limit || 20,
        offset: offset || 0,
        invoiceStatus: filters.statuses || [],
      },
    },
  ])

  const { orders, count } = getOrdersData?.getOrders || { orders: [], count: 0 }

  const total = count ?? 0
  const getOrdersStatus = getSWRLoadingStatus(getOrdersData, getOrdersError)

  return {
    orders: orders as OrderInfo[],
    total,
    error: getOrdersError,
    isLoading: getOrdersStatus === LoadingStatus.FETCHING,
  }
}
