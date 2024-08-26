import React from 'react'
import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import { GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY } from '@app/components/filters/FilterByCourseResidingCountry/queries/get-distinct-course-countries'
import {
  Currency,
  GetDistinctCourseResidingCountriesQuery,
  OrdersQueryVariables,
  Payment_Methods_Enum,
  Xero_Invoice_Status_Enum,
} from '@app/generated/graphql'

import {
  render,
  renderHook,
  screen,
  userEvent,
  waitFor,
  within,
} from '@test/index'

import { Orders } from '.'

const user = userEvent.setup()

describe('page: Orders filtering', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('filters by search', async () => {
    const SEARCH_TEXT = 'search'
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Orders />
      </Provider>,
    )

    await user.type(screen.getByPlaceholderText(/search/i), SEARCH_TEXT)

    await waitFor(() => {
      const ilike = { _ilike: `%${SEARCH_TEXT}%` }

      expect(queryVariables.where?._or).toEqual(
        expect.objectContaining([
          {
            courses: { course: { name: ilike } },
          },
          {
            courses: { course: { course_code: ilike } },
          },
          {
            organization: {
              name: ilike,
            },
          },
          {
            xeroInvoiceNumber: ilike,
          },
          {
            organization: {
              address: {
                _cast: { String: ilike },
              },
            },
          },
        ]),
      )
    })
  })

  it('filters by payment method', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Orders />
      </Provider>,
    )

    const paymentMethodFilter = screen.getByTestId('payment-method')

    await user.click(within(paymentMethodFilter).getByText(/payment method/i))
    await user.click(within(paymentMethodFilter).getByText(/credit card/i))

    await waitFor(() => {
      expect(queryVariables.where).toEqual(
        expect.objectContaining({
          paymentMethod: {
            _in: [Payment_Methods_Enum.Cc],
          },
        }),
      )
    })
  })
  it('filters by currency', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Orders />
      </Provider>,
    )

    const paymentMethodFilter = screen.getByTestId('currency-filter')

    await user.click(within(paymentMethodFilter).getByText(/currency/i))
    await user.click(within(paymentMethodFilter).getByText(t('filters.GBP')))

    await waitFor(() => {
      expect(queryVariables.where).toEqual(
        expect.objectContaining({
          currency: {
            _in: [Currency.Gbp],
          },
        }),
      )
    })
  })

  it('filters by invoice status', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({ variables }: { variables: OrdersQueryVariables }) => {
        queryVariables = variables

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Orders />
      </Provider>,
    )

    const statusFilter = screen.getByTestId('status-filter')

    await user.click(within(statusFilter).getByText(/status/i))

    await user.click(within(statusFilter).getByText(/awaiting payment/i))
    await user.click(within(statusFilter).getByText(/draft/i))

    await waitFor(() => {
      expect(queryVariables.where).toEqual(
        expect.objectContaining({
          _or: [
            {
              invoice: {
                status: {
                  _in: [
                    Xero_Invoice_Status_Enum.Authorised,
                    Xero_Invoice_Status_Enum.Submitted,
                    Xero_Invoice_Status_Enum.Draft,
                  ],
                },
              },
            },
          ],
        }),
      )
    })
  })

  it('filters by course residing country', async () => {
    let queryVariables: OrdersQueryVariables

    const client = {
      executeQuery: ({
        query,
        variables,
      }: {
        query: TypedDocumentNode
        variables: OrdersQueryVariables
      }) => {
        queryVariables = variables

        if (query === GET_DISTINCT_COURSE_RESIDING_COUNTRIES_QUERY) {
          return fromValue<{ data: GetDistinctCourseResidingCountriesQuery }>({
            data: {
              course: [
                { residingCountry: 'GB-ENG' },
                { residingCountry: 'RO' },
                { residingCountry: 'MD' },
              ],
            },
          })
        }

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Orders />
      </Provider>,
    )

    const statusFilter = screen.getByTestId('course-residing-country-filter')

    await user.click(within(statusFilter).getByText('England'))

    await waitFor(() => {
      expect(queryVariables.where).toEqual(
        expect.objectContaining({
          _or: [
            {
              courses: {
                course: {
                  residingCountry: { _in: ['GB-ENG'] },
                },
              },
            },
          ],
        }),
      )
    })
  })
})
