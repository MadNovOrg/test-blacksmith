import { addHours } from 'date-fns'
import { DocumentNode } from 'graphql'
import React from 'react'
import { Client, Provider, CombinedError } from 'urql'
import { never, fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  GetOrderQuery,
  GetXeroInvoicesForOrdersQuery,
  Payment_Methods_Enum,
  XeroAddressType,
  XeroInvoiceStatus,
  XeroPhoneType,
} from '@app/generated/graphql'
import { usePromoCodes } from '@app/hooks/usePromoCodes'
import { QUERY as GET_ORDER_QUERY } from '@app/queries/order/get-order'
import { QUERY as GET_XERO_INVOICES_FOR_ORDERS } from '@app/queries/xero/get-xero-invoices-for-orders'
import { LoadingStatus } from '@app/util'

import { chance, formatCurrency, render, screen, within } from '@test/index'

import {
  buildInvoice,
  buildLineItem,
  buildOrder,
  buildPromo,
} from './mock-utils'

import { OrderDetails } from '.'

jest.mock('@app/hooks/usePromoCodes')

const usePromoCodesMock = jest.mocked(usePromoCodes)

describe('page: OrderDetails', () => {
  beforeEach(() => {
    usePromoCodesMock.mockReturnValue({
      promoCodes: [],
      isLoading: false,
      total: 0,
      error: undefined,
      status: LoadingStatus.IDLE,
    })
  })

  it('renders loading while fetching for order and invoice', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders not found page if there is an error fetching order or invoice', () => {
    const client = {
      executeQuery: () =>
        fromValue({
          error: new CombinedError({
            networkError: Error('something went wrong!'),
          }),
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    expect(
      screen.getByText('Something wrong happened. Please try again later')
    ).toBeInTheDocument()
  })

  it('renders course information', () => {
    const order = buildOrder()
    const courseStartDate = new Date('2023-01-25T08:00:00Z').toISOString()
    const courseEndDate = addHours(
      new Date('2023-01-25T08:00:00Z'),
      8
    ).toISOString()

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_ORDER_QUERY) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              order: {
                ...order,
                course: {
                  ...order.course,
                  level: Course_Level_Enum.Level_1,
                  start: courseStartDate,
                  end: courseEndDate,
                },
              },
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
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    expect(
      screen.getByTestId('order-course-title').textContent
    ).toMatchInlineSnapshot(`"Level One  - 8 hours (course-code)"`)

    expect(
      screen.getByTestId('order-course-duration').textContent
    ).toMatchInlineSnapshot(`"25 Jan 202308:00 AM - 04:00 PM"`)
  })

  it('renders registrant emails and prices', () => {
    const user1Email = chance.email()
    const user2Email = chance.email()
    const unitPrice = 130

    const order = buildOrder({
      overrides: {
        registrants: [user1Email, user2Email],
      },
    })
    const invoice = buildInvoice({
      overrides: {
        lineItems: [
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: 'Level One',
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: 'Level One',
            },
          }),
        ],
      },
    })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_ORDER_QUERY) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              order: {
                ...order,
                course: {
                  ...order.course,
                  level: Course_Level_Enum.Level_1,
                },
              },
            },
          })
        }

        if (query === GET_XERO_INVOICES_FOR_ORDERS) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              invoices: [invoice],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    const user1Row = screen.getByTestId(`order-registrant-${user1Email}`)

    expect(within(user1Row).getByText(user1Email)).toBeInTheDocument()
    expect(
      within(user1Row).getByText(formatCurrency(unitPrice))
    ).toBeInTheDocument()
  })

  it('renders blended learning licenses information if purchased', () => {
    const unitPrice = 25

    const order = buildOrder({
      overrides: {
        quantity: 5,
        registrants: [],
      },
    })
    const invoice = buildInvoice({
      overrides: {
        lineItems: [
          buildLineItem({
            overrides: {
              unitAmount: unitPrice,
              description: 'Go1 licenses',
            },
          }),
        ],
      },
    })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_ORDER_QUERY) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              order: {
                ...order,
                course: {
                  ...order.course,
                  level: Course_Level_Enum.Level_1,
                },
              },
            },
          })
        }

        if (query === GET_XERO_INVOICES_FOR_ORDERS) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              invoices: [invoice],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    expect(
      screen.getByText(`${formatCurrency(unitPrice)} per attendee`)
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('order-quantity')).getByText(order.quantity)
    ).toBeInTheDocument()
  })

  it('renders promo code if applied to an order', () => {
    const discountAmount = -25

    const order = buildOrder()
    const invoice = buildInvoice({
      overrides: {
        lineItems: [
          buildLineItem({
            overrides: {
              lineAmount: discountAmount,
              description: 'Discount',
            },
          }),
        ],
      },
    })
    const promoCode = buildPromo({
      overrides: {
        amount: 5,
        code: 'CODE_5%_ALL',
      },
    })

    usePromoCodesMock.mockReturnValue({
      promoCodes: [promoCode],
      isLoading: false,
      status: LoadingStatus.IDLE,
      error: undefined,
      total: 1,
    })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
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
              invoices: [invoice],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    const promoCodeRow = screen.getByTestId('order-promo-code')

    expect(
      within(promoCodeRow).getByText(`Promo code: ${promoCode.code}`)
    ).toBeInTheDocument()
    expect(
      within(promoCodeRow).getByText(formatCurrency(discountAmount))
    ).toBeInTheDocument()
  })

  it('renders prices and taxes', () => {
    const subTotal = 100
    const vat = 25
    const total = 125
    const paidOnDate = new Date('2023-01-25T08:00:00Z').toISOString()

    const order = buildOrder()
    const invoice = buildInvoice({
      overrides: {
        subTotal,
        total,
        totalTax: vat,
        status: XeroInvoiceStatus.Paid,
        fullyPaidOnDate: paidOnDate,
        amountDue: String(0),
        amountPaid: String(total),
      },
    })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
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
              invoices: [invoice],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    const subTotalRow = screen.getByTestId('order-subtotal')
    const vatRow = screen.getByTestId('order-vat')
    const totalRow = screen.getByTestId('order-total')
    const dueDateRow = screen.getByTestId('order-due-date')
    const paidRow = screen.getByTestId('order-paid-on')
    const amountDueRow = screen.getByTestId('order-amount-due')

    expect(
      within(subTotalRow).getByText(formatCurrency(subTotal))
    ).toBeInTheDocument()
    expect(within(vatRow).getByText(formatCurrency(vat))).toBeInTheDocument()
    expect(
      within(totalRow).getByText(formatCurrency(total))
    ).toBeInTheDocument()
    expect(within(dueDateRow).getByText(/paid/i)).toBeInTheDocument()
    expect(
      within(paidRow).getByText(formatCurrency(Number(invoice.amountPaid)))
    ).toBeInTheDocument()
    expect(
      within(amountDueRow).getByText(formatCurrency(Number(invoice.amountDue)))
    ).toBeInTheDocument()
  })

  it('renders payment information', () => {
    const order = buildOrder({
      overrides: {
        paymentMethod: Payment_Methods_Enum.Cc,
      },
    })
    const invoice = buildInvoice()

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
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
              invoices: [invoice],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    expect(screen.getByText(/pay by credit card/i)).toBeInTheDocument()
  })

  it('renders sales person if order is made to a closed course', () => {
    const order = buildOrder()
    const invoice = buildInvoice()

    const salesPerson = chance.name({ full: true })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_ORDER_QUERY) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              order: {
                ...order,
                course: {
                  ...order.course,
                  type: Course_Type_Enum.Closed,
                  salesRepresentative: {
                    fullName: salesPerson,
                  },
                },
              },
            },
          })
        }

        if (query === GET_XERO_INVOICES_FOR_ORDERS) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              invoices: [invoice],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    expect(screen.getByText(/sales person/i)).toBeInTheDocument()
    expect(screen.getByText(salesPerson)).toBeInTheDocument()
  })

  it('renders invoice to information', () => {
    const invoicePhone = chance.phone()

    const order = buildOrder({
      overrides: {
        paymentMethod: Payment_Methods_Enum.Invoice,
      },
    })
    const invoice = buildInvoice()

    invoice.contact.addresses = [
      {
        addressType: XeroAddressType.Pobox,
        addressLine1: 'Tankfield',
        addressLine2: 'Convent Hill',
        city: 'Tramore',
        postalCode: 'X91 PV08',
        country: 'UK',
      },
    ]

    const salesPerson = chance.name({ full: true })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_ORDER_QUERY) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              order: {
                ...order,
                course: {
                  ...order.course,
                  type: Course_Type_Enum.Closed,
                  salesRepresentative: {
                    fullName: salesPerson,
                  },
                },
              },
            },
          })
        }

        if (query === GET_XERO_INVOICES_FOR_ORDERS) {
          return fromValue<
            { data: GetOrderQuery } | { data: GetXeroInvoicesForOrdersQuery }
          >({
            data: {
              invoices: [
                {
                  ...invoice,
                  contact: {
                    ...invoice.contact,
                    phones: [
                      {
                        phoneType: XeroPhoneType.Default,
                        phoneNumber: invoicePhone,
                      },
                    ],
                  },
                },
              ],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>
    )

    const invoicedToRow = screen.getByTestId('order-invoiced-to')

    expect(
      within(invoicedToRow).getByText(invoice.contact.name)
    ).toBeInTheDocument()

    expect(
      within(invoicedToRow).getByText(
        `${invoice.contact.firstName} ${invoice.contact.lastName}`
      )
    ).toBeInTheDocument()

    expect(
      within(invoicedToRow).getByText(invoice.contact.emailAddress ?? '')
    ).toBeInTheDocument()

    expect(within(invoicedToRow).getByText(invoicePhone)).toBeInTheDocument()
    expect(
      within(invoicedToRow).getByTestId('contact-address').textContent
    ).toMatchInlineSnapshot(`"Tankfield, Convent Hill, Tramore, X91 PV08, UK"`)
  })
})
