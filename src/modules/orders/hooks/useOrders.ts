import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  Currency,
  OrdersQuery,
  OrdersQueryVariables,
  Order_Bool_Exp,
  Order_By,
  Order_Order_By,
  Payment_Methods_Enum,
  Xero_Invoice_Status_Enum,
} from '@app/generated/graphql'
import { SortOrder } from '@app/types'

import { GET_ORDERS } from '../queries/query'

export type FiltersType = {
  currencies?: Currency[]
  paymentMethods?: Payment_Methods_Enum[]
  searchParam?: string
  statuses?: Xero_Invoice_Status_Enum[]
}

export type UseOrdersProps = {
  sort: { by: string; dir: SortOrder }
  filters: FiltersType
  limit: number
  offset: number
}

const isFilterValid = (filter?: FiltersType[keyof FiltersType] | string) =>
  Number(filter?.length) > 0

export const useOrders = ({ sort, filters, limit, offset }: UseOrdersProps) => {
  const where = useMemo(() => {
    const where: Order_Bool_Exp = {}

    if (isFilterValid(filters.currencies)) {
      where.currency = { _in: filters.currencies }
    }

    if (isFilterValid(filters.paymentMethods)) {
      where.paymentMethod = { _in: filters.paymentMethods }
    }

    if (isFilterValid(filters.searchParam)) {
      where._or = []
      where._or.push({
        courses: { course: { name: { _ilike: `%${filters.searchParam}%` } } },
      })
      where._or.push({
        courses: {
          course: { course_code: { _ilike: `%${filters.searchParam}%` } },
        },
      })
      where._or.push({
        organization: { name: { _ilike: `%${filters.searchParam}%` } },
      })
      where._or.push({
        xeroInvoiceNumber: { _ilike: `%${filters.searchParam}%` },
      })
      where._or.push({
        organization: {
          address: {
            _cast: { String: { _ilike: `%${filters.searchParam}%` } },
          },
        },
      })

      const onlyDigits = /^\d+$/.test(filters.searchParam ?? '')

      if (onlyDigits) {
        where._or.push({ orderDue: { _eq: filters.searchParam } })
        where._or.push({ orderTotal: { _eq: filters.searchParam } })
      }
    }

    if (isFilterValid(filters.statuses)) {
      where._or = where._or ?? []

      where._or.push({ invoice: { status: { _in: filters.statuses } } })
    }

    return where
  }, [filters])

  const orderBy = useMemo(() => {
    let orderBy: Order_Order_By = {}
    const dir = sort.dir === 'asc' ? Order_By.Asc : Order_By.Desc

    switch (sort.by) {
      case 'invoice.total': {
        orderBy = {
          invoice: {
            total: dir,
          },
        }
        break
      }
      case 'organization.name': {
        orderBy = {
          organization: {
            name: dir,
          },
        }
        break
      }
      case 'invoice.amountDue': {
        orderBy = {
          invoice: {
            amountDue: dir,
          },
        }
        break
      }
      case 'invoice.dueDate': {
        orderBy = {
          invoice: {
            dueDate: dir,
          },
        }
        break
      }
      case 'xeroInvoiceNumber': {
        orderBy = {
          xeroInvoiceNumber: dir,
        }
        break
      }
      case 'paymentMethod': {
        orderBy = {
          paymentMethod: dir,
        }
        break
      }
      case 'invoice.reference': {
        orderBy = {
          invoice: {
            reference: dir,
          },
        }
        break
      }
      case 'invoice.status': {
        orderBy = {
          invoice: {
            status: dir,
          },
        }
        break
      }
      default: {
        orderBy = {}
      }
    }

    return orderBy
  }, [sort])

  const [{ data, error, fetching }] = useQuery<
    OrdersQuery,
    OrdersQueryVariables
  >({
    query: GET_ORDERS,
    requestPolicy: 'cache-and-network',
    variables: {
      where,
      limit,
      offset,
      orderBy,
    },
  })

  return {
    orders: data?.order,
    total: data?.order_aggregate.aggregate?.count ?? 0,
    error,
    isLoading: fetching,
  }
}
