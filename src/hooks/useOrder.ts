import { useQuery } from 'urql'

import {
  GetOrderQuery,
  GetOrderQueryVariables,
  GetXeroInvoicesForOrdersQuery,
  GetXeroInvoicesForOrdersQueryVariables,
} from '@app/generated/graphql'
import { QUERY as GET_ORDER } from '@app/queries/order/get-order'
import { QUERY as GET_XERO_INVOICES_FOR_ORDERS } from '@app/queries/xero/get-xero-invoices-for-orders'

export type UseOrder = {
  order?: GetOrderQuery['order']
  invoice?: GetXeroInvoicesForOrdersQuery['invoices'][number]
  error?: Error
  isLoading?: boolean
}

export const useOrder = (orderId: string): UseOrder => {
  const [{ data, error: orderError, fetching: fetchingOrder }] = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >({
    query: GET_ORDER,
    variables: { orderId },
    requestPolicy: 'cache-and-network',
  })

  const order = data?.order

  const [
    {
      data: getXeroInvoicesForOrdersData,
      error: getXeroInvoicesForOrdersError,
      fetching: fetchingInvoice,
    },
  ] = useQuery<
    GetXeroInvoicesForOrdersQuery,
    GetXeroInvoicesForOrdersQueryVariables
  >({
    query: GET_XERO_INVOICES_FOR_ORDERS,
    pause: !order,
    variables: { invoiceNumbers: [order?.xeroInvoiceNumber ?? ''] },
    requestPolicy: 'cache-and-network',
  })

  const { invoices } = getXeroInvoicesForOrdersData ?? { invoices: [] }

  return {
    order,
    invoice: invoices?.length ? invoices[0] : null,
    error: orderError || getXeroInvoicesForOrdersError,
    isLoading: fetchingOrder || fetchingInvoice,
  }
}
