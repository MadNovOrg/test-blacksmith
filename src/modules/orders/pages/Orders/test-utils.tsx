import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  OrderInfoFragment,
  Payment_Methods_Enum,
  Currency,
  OrdersQuery,
} from '@app/generated/graphql'
import { buildInvoice } from '@app/modules/order_details/pages/OrderDetails/mock-utils'

import { chance, render } from '@test/index'

export function buildOrder(
  overrides?: Partial<OrderInfoFragment>,
): OrderInfoFragment {
  return {
    id: chance.guid(),
    orderDue: chance.date(),
    xeroInvoiceNumber: chance.string(),
    courses: [{ course: { course_code: 'code' } }],
    paymentMethod: Payment_Methods_Enum.Cc,
    orderTotal: chance.integer(),
    currency: Currency.Gbp,
    organization: {
      id: chance.guid(),
      name: chance.name(),
      address: chance.address(),
    },
    invoice: buildInvoice(),
    ...overrides,
  }
}

export const renderWithOrders = (
  ui: React.ReactElement,
  { orders, total }: { orders: OrdersQuery['order']; total: number },
) => {
  const client = {
    executeQuery: () => {
      return fromValue<{ data: OrdersQuery }>({
        data: {
          order: orders,
          order_aggregate: {
            aggregate: {
              count: total,
            },
          },
        },
      })
    },
  } as unknown as Client

  return render(<Provider value={client}>{ui}</Provider>)
}
