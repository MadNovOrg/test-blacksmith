import { DocumentNode } from 'graphql'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Client, Provider, CombinedError } from 'urql'
import { never, fromValue } from 'wonka'

import {
  GetOrderQuery,
  GetXeroInvoicesForOrdersQuery,
} from '@app/generated/graphql'
import { QUERY as GET_ORDER_QUERY } from '@app/queries/order/get-order'
import { QUERY as GET_XERO_INVOICES_FOR_ORDERS } from '@app/queries/xero/get-xero-invoices-for-orders'

import { render, screen } from '@test/index'

import { buildInvoice, buildOrder } from './mock-utils'

import { OrderDetails } from '.'

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('page: OrderDetails', () => {
  it('renders loading while fetching for order and invoice', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <MemoryRouter>
        <Provider value={client}>
          <OrderDetails />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders an alert if there is an error fetching order or invoice', () => {
    const client = {
      executeQuery: () =>
        fromValue({
          error: new CombinedError({
            networkError: Error('something went wrong!'),
          }),
        }),
    } as unknown as Client

    render(
      <MemoryRouter>
        <Provider value={client}>
          <OrderDetails />
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"Something wrong happened. Please try again later"`
    )
  })

  it('renders course information', () => {
    const order = buildOrder()

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        console.log(query === GET_ORDER_QUERY)

        if (query === GET_ORDER_QUERY) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              order,
            },
          })
        }

        if (query === GET_XERO_INVOICES_FOR_ORDERS) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              invoices: [buildInvoice()],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <MemoryRouter>
        <Provider value={client}>
          <OrderDetails />
        </Provider>
      </MemoryRouter>
    )

    expect(
      screen.getByText(`${order?.course.name} (${order?.course.course_code})`)
    ).toBeInTheDocument()
  })

  it.todo('renders registrant emails and prices')
  it.todo('renders blended learning licenses information if purchased')
  it.todo('renders promo code if applied to an order')
  it.todo('renders prices and taxes')
  it.todo('renders payment information')
  it.todo('renders due amount, date and invoice status')
  it.todo('renders sales person if order is made to a closed course')
  it.todo('renders other invoice information')
  it.todo('links to an invoice in Xero')
})
