import { useMemo } from 'react'
import useSWR from 'swr'

import {
  Order_By,
  Currency,
  GetOrdersQuery,
  Order_Order_By,
  XeroInvoiceStatus,
  Payment_Methods_Enum,
  GetOrdersQueryVariables,
  GetXeroInvoicesStatusQuery,
  GetXeroInvoicesStatusQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GET_ORDERS } from '@app/queries/order/get-orders'
import { QUERY as GET_XERO_INVOICES_STATUS } from '@app/queries/xero/get-xero-invoices-status'
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

export type OrderType = {
  id: string
  status: XeroInvoiceStatus
} & GetOrdersQuery['orders'][number]

type GenericOrderType = {
  [key: string]: string | GenericOrderType
}

const isFilterValid = (filter?: FiltersType[keyof FiltersType] | string) =>
  filter && filter.length && filter.length > 0

export const useOrders = ({ sort, filters, limit, offset }: UseOrdersProps) => {
  const getOrdersWhere = useMemo(() => {
    const where: GetOrdersQueryVariables['where'] = {}

    if (isFilterValid(filters.currencies)) {
      where.currency = { _in: filters.currencies }
    }

    if (isFilterValid(filters.paymentMethods)) {
      where.paymentMethod = { _in: filters.paymentMethods }
    }

    if (isFilterValid(filters.searchParam)) {
      where._or = [
        { course: { name: { _ilike: `%${filters.searchParam}%` } } },
        { organization: { name: { _ilike: `%${filters.searchParam}%` } } },
      ]
    }

    // TODO
    // Add support for filtering with Xero's order ID as well once we have that mapped with our orders

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

  const getXeroInvoicesStatusWhere = useMemo(() => {
    const where: { statuses?: XeroInvoiceStatus[] } = {}

    if (filters.statuses) {
      where.statuses = filters.statuses
    }

    return where
  }, [filters])

  const { data: getOrdersData, error: getOrdersError } = useSWR<
    GetOrdersQuery,
    Error,
    [string, GetOrdersQueryVariables]
  >([
    GET_ORDERS,
    {
      orderBy: getOrdersOrderBy,
      where: getOrdersWhere,
      limit,
      offset,
    },
  ])

  const {
    orders,
    order_aggregate: { aggregate },
  } = getOrdersData ?? {
    orders: [],
    order_aggregate: { aggregate: { count: 0 } },
  }

  const total = aggregate?.count ?? 0

  const { data: getXeroInvoicesStatusData, error: getXeroInvoicesStatusError } =
    useSWR<
      GetXeroInvoicesStatusQuery,
      Error,
      [string, GetXeroInvoicesStatusQueryVariables]
    >([
      GET_XERO_INVOICES_STATUS,
      {
        input: {
          orderIds: orders.map(o => o.id),
          ...getXeroInvoicesStatusWhere,
        },
      },
    ])

  const getOrdersStatus = getSWRLoadingStatus(getOrdersData, getOrdersError)

  const getXeroInvoicesStatusStatus = getSWRLoadingStatus(
    getXeroInvoicesStatusData,
    getXeroInvoicesStatusError
  )

  const _orders = useMemo(
    () =>
      orders.map(o => ({
        ...o,
        status:
          getXeroInvoicesStatusData?.xeroInvoicesStatus?.invoices.find(
            i => i?.orderId === o.id
          )?.status ?? XeroInvoiceStatus.Draft,
      })),
    [orders, getXeroInvoicesStatusData]
  )

  return {
    orders: _orders,
    total,
    ordersStatus: getXeroInvoicesStatusData?.xeroInvoicesStatus?.invoices ?? [],
    error: getOrdersError || getXeroInvoicesStatusError,
    isLoading:
      getOrdersStatus === LoadingStatus.FETCHING ||
      getXeroInvoicesStatusStatus === LoadingStatus.FETCHING,
  }
}
