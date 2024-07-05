import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  OrdersQuery,
  OrdersQueryVariables,
  Payment_Methods_Enum,
  Xero_Invoice_Status_Enum,
} from '@app/generated/graphql'

import {
  formatCurrency,
  screen,
  userEvent,
  waitFor,
  within,
  render,
} from '@test/index'

import { buildInvoice } from '../OrderDetails/mock-utils'

import { buildOrder, renderWithOrders } from './test-utils'

import { Orders } from '.'

const user = userEvent.setup()

describe('page: Orders', () => {
  it('renders total number of orders', () => {
    renderWithOrders(<Orders />, { orders: [], total: 3 })

    expect(screen.getByText(/3 items/i)).toBeInTheDocument()
  })

  it('renders orders in a table', () => {
    const order = buildOrder({
      paymentMethod: Payment_Methods_Enum.Invoice,
      invoice: {
        ...buildInvoice(),
        status: Xero_Invoice_Status_Enum.Draft,
      },
    })

    renderWithOrders(<Orders />, { orders: [order], total: 3 })

    const tableRow = screen.getByTestId(order.id)

    expect(
      within(tableRow).getByText(order.xeroInvoiceNumber ?? ''),
    ).toBeInTheDocument()

    expect(
      within(tableRow).getByText(order.courses[0].course?.course_code ?? ''),
    ).toBeInTheDocument()
    expect(
      within(tableRow).getByText(order.organization.name),
    ).toBeInTheDocument()
    expect(within(tableRow).getByText(/draft/i)).toBeInTheDocument()
    expect(
      within(tableRow).getByText(formatCurrency(order.invoice?.amountDue)),
    ).toBeInTheDocument()
    expect(
      within(tableRow).getByText(formatCurrency(order.invoice?.total)),
    ).toBeInTheDocument()
    expect(within(tableRow).getByText(/invoice/i)).toBeInTheDocument()
  })

  it('paginates orders', async () => {
    const firstBatch = [buildOrder()]
    const secondBatch = [buildOrder()]

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        const orders = variables.offset === 0 ? firstBatch : secondBatch

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: orders,
            order_aggregate: {
              aggregate: {
                count: 20,
              },
            },
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Orders />
      </Provider>,
    )

    expect(screen.getByTestId(firstBatch[0].id)).toBeInTheDocument()
    expect(screen.queryByTestId(secondBatch[0].id)).not.toBeInTheDocument()

    const nextPageArrow = screen.getByLabelText(/go to next page/i)

    await user.click(nextPageArrow)

    await waitFor(() => {
      expect(screen.queryByTestId(firstBatch[0].id)).not.toBeInTheDocument()
      expect(screen.getByTestId(secondBatch[0].id)).toBeInTheDocument()
    })
  })
})
