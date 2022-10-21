import useSWR from 'swr'

import {
  GetOrderQuery,
  GetOrderQueryVariables,
  GetCourseByIdQuery as GetCourseQuery,
  GetCourseByIdQueryVariables as GetCourseQueryVariables,
  GetXeroInvoicesForOrdersQuery,
  GetXeroInvoicesForOrdersQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GET_COURSE } from '@app/queries/courses/get-course-by-id'
import { QUERY as GET_ORDER } from '@app/queries/order/get-order'
import { QUERY as GET_XERO_INVOICES_FOR_ORDERS } from '@app/queries/xero/get-xero-invoices-for-orders'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

export type UseOrder = {
  order?: GetOrderQuery['order']
  course?: GetCourseQuery['course']
  invoice?: GetXeroInvoicesForOrdersQuery['invoices'][number]
  error?: Error
  isLoading?: boolean
}

export const useOrder = (orderId: string): UseOrder => {
  const { data: getOrderData, error: getOrderError } = useSWR<
    GetOrderQuery,
    Error,
    [string, GetOrderQueryVariables]
  >([GET_ORDER, { orderId }])

  const { order } = getOrderData ?? ({ order: {} } as UseOrder)

  const {
    data: getXeroInvoicesForOrdersData,
    error: getXeroInvoicesForOrdersError,
  } = useSWR<
    GetXeroInvoicesForOrdersQuery,
    Error,
    [string, GetXeroInvoicesForOrdersQueryVariables]
  >([
    GET_XERO_INVOICES_FOR_ORDERS,
    { invoiceNumbers: [order?.xeroInvoiceNumber ?? ''] },
  ])

  const { invoices } = getXeroInvoicesForOrdersData ?? { invoices: [] }
  const invoice = (invoices[0] ?? {}) as UseOrder['invoice']

  const { data: getCourseData, error: getCourseError } = useSWR<
    GetCourseQuery,
    Error,
    [string, GetCourseQueryVariables]
  >([GET_COURSE, { id: order?.courseId ?? 0 }])

  const { course } = getCourseData ?? ({ course: {} } as UseOrder)

  const getOrderStatus = getSWRLoadingStatus(getOrderData, getOrderError)
  const getCourseStatus = getSWRLoadingStatus(getCourseData, getCourseError)
  const getXeroInvoicesForOrdersStatus = getSWRLoadingStatus(
    getXeroInvoicesForOrdersData,
    getXeroInvoicesForOrdersError
  )

  return {
    order,
    course,
    invoice,
    error: getOrderError || getXeroInvoicesForOrdersError,
    isLoading:
      getOrderStatus === LoadingStatus.FETCHING ||
      getCourseStatus === LoadingStatus.FETCHING ||
      getXeroInvoicesForOrdersStatus === LoadingStatus.FETCHING,
  }
}
