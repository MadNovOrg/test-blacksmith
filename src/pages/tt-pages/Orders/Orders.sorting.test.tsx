import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  OrdersQuery,
  OrdersQueryVariables,
  Order_By,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { buildOrder } from './test-utils'

import { Orders } from '.'

const user = userEvent.setup()

describe('page: Orders sorting', () => {
  it('sorts by invoice number', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(
      within(screen.getByTestId('table-head')).getByText(/invoice no/i),
    )

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        xeroInvoiceNumber: Order_By.Asc,
      })
    })
  })

  it('sorts by reference number', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(
      within(screen.getByTestId('table-head')).getByText(/reference/i),
    )

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        invoice: {
          reference: Order_By.Asc,
        },
      })
    })
  })

  it('sorts by bill to', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(
      within(screen.getByTestId('table-head')).getByText(/bill to/i),
    )

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        organization: {
          name: Order_By.Asc,
        },
      })
    })
  })

  it('sorts by payment method', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(
      within(screen.getByTestId('table-head')).getByText(/payment method/i),
    )

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        paymentMethod: Order_By.Asc,
      })
    })
  })

  it('sorts by order total', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(
      within(screen.getByTestId('table-head')).getByText(/amount/i),
    )

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        invoice: {
          total: Order_By.Asc,
        },
      })
    })
  })

  it('sorts by amount due', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(within(screen.getByTestId('table-head')).getByText('Due'))

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        invoice: {
          amountDue: Order_By.Asc,
        },
      })
    })
  })

  it('sorts by due date', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(
      within(screen.getByTestId('table-head')).getByText(/due date/i),
    )

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        invoice: {
          dueDate: Order_By.Asc,
        },
      })
    })
  })

  it('sorts by invoice status', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return fromValue<{ data: OrdersQuery }>({
          data: {
            order: [buildOrder()],
            order_aggregate: {
              aggregate: {
                count: 1,
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

    await user.click(
      within(screen.getByTestId('table-head')).getByText(/status/i),
    )

    await waitFor(() => {
      expect(queryVariables.orderBy).toEqual({
        invoice: {
          status: Order_By.Asc,
        },
      })
    })
  })
})
