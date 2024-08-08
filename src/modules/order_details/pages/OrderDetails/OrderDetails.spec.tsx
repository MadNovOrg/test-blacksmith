import { addHours, format } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useTranslation } from 'react-i18next'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  GetCourseOrdersQuery,
  GetShallowAttendeeAuditLogsQuery,
  Payment_Methods_Enum,
  Xero_Invoice_Status_Enum,
  XeroAddressType,
  XeroLineItemSummaryFragment,
  XeroPhoneType,
} from '@app/generated/graphql'
import { usePromoCodes } from '@app/hooks/usePromoCodes'
import useTimeZones from '@app/hooks/useTimeZones'

import {
  chance,
  formatCurrency,
  render,
  renderHook,
  screen,
  within,
} from '@test/index'

import { GET_COURSE_ORDERS } from '../../hooks/useCourseOrders'
import { GET_SHALLOW_ATTENDEE_AUDIT_LOGS_QUERY } from '../../hooks/useShallowAttendeeAudits'
import { CourseWorkbooks } from '../../utils'

import {
  buildInvoice,
  buildLineItem,
  buildOrder,
  buildPromo,
} from './mock-utils'

import { OrderDetails } from '.'

vi.mock('@app/hooks/usePromoCodes')

const usePromoCodesMock = vi.mocked(usePromoCodes)
vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe('page: OrderDetails', () => {
  const order = buildOrder()
  const baseOrder = order[0].order
  const course = order[0].course
  const courseStartDate = new Date('2023-01-25T08:00:00+00:00').toISOString()
  const courseEndDate = addHours(
    new Date('2023-01-25T08:00:00+00:00'),
    8,
  ).toISOString()

  const baseCourse = {
    id: course,
    level: Course_Level_Enum.Level_1,
    start: course?.start,
    end: course?.end,
    name: course?.name ?? '',
    type: course?.type ?? Course_Type_Enum.Open,
    go1Integration: course?.go1Integration ?? false,
    deliveryType: course?.deliveryType ?? Course_Delivery_Type_Enum.Virtual,
    max_participants: 1,
    dates: {
      aggregate: {
        start: {
          date: courseStartDate,
        },
        end: {
          date: courseEndDate,
        },
      },
    },
    schedule: [
      {
        timezone: 'Europe/London',
      },
    ],
  }
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const {
    result: {
      current: { formatGMTDateTimeByTimeZone },
    },
  } = renderHook(() => useTimeZones())

  beforeEach(() => {
    usePromoCodesMock.mockReturnValue({
      promoCodes: [],
      isLoading: false,
      total: 0,
      error: undefined,
      mutate: vi.fn(),
      fetching: false,
    })
  })

  it('renders loading while fetching for order and invoice', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders not found page if there is an error fetching order', () => {
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
      </Provider>,
    )

    expect(
      screen.getByText('Something wrong happened. Please try again later'),
    ).toBeInTheDocument()
  })

  it('renders course information', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...baseOrder,
                    invoice: buildInvoice(),
                  },
                  course: {
                    ...baseCourse,
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )
    expect(
      screen.getByTestId('order-course-title').textContent,
    ).toMatchInlineSnapshot(`"Level One  - 8 hours "`)
    expect(
      screen.getByTestId('order-course-duration').textContent,
    ).toMatchInlineSnapshot(
      `"${format(new Date(courseStartDate), 'd LLL yyyyhh:mm a')} - ${format(
        new Date(courseEndDate),
        'hh:mm a',
      )}(local time)"`,
    )
  })

  it('renders order line items', () => {
    const user1Email = chance.email()
    const user2Email = chance.email()
    const unitPrice = 130
    const invoice = buildInvoice({
      overrides: {
        lineItems: [
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: `Level One, ${user1Email}`,
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: `Level One, ${user2Email}`,
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 12,
              unitAmount: 10,
              itemCode: CourseWorkbooks.Mandatory,
              description: `Mandatory Course Materials x ${12}`,
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 12,
              unitAmount: 0,
              itemCode: CourseWorkbooks.Free,
              description: `Free Course Materials x ${12}`,
            },
          }),
        ],
      },
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    registrants: [user1Email, user2Email],
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  },
                  course: {
                    ...baseCourse,
                    bookingContact: {
                      fullName: chance.name(),
                    },
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    const user1Row = screen.getByTestId(`order-registrant-0`)
    const mandatoryCourseMaterialsRow = screen.getByTestId(
      `line-item-${CourseWorkbooks.Mandatory}`,
    )
    const freeCourseMaterialsRow = screen.getByTestId(
      `line-item-${CourseWorkbooks.Free}`,
    )

    expect(
      within(user1Row).getByText(invoice.lineItems[0].description),
    ).toBeInTheDocument()
    expect(
      within(user1Row).getByText(formatCurrency(unitPrice)),
    ).toBeInTheDocument()
    expect(
      within(mandatoryCourseMaterialsRow).getByText(
        t('pages.order-details.mandatory-course-materials', {
          count: invoice.lineItems[2].quantity,
        }),
      ),
    )
    expect(
      within(freeCourseMaterialsRow).getByText(
        t('pages.order-details.free-course-materials', {
          count: invoice.lineItems[3].quantity,
        }),
      ),
    )
  })

  it('disaply cancelled on line items where attendee was cancelled', () => {
    const user1Email = chance.email()
    const user2Email = chance.email()
    const unitPrice = 130
    const invoice = buildInvoice({
      overrides: {
        lineItems: [
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: `Level One, ${user1Email}`,
              lineItemID: chance.guid(),
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: `Level One, ${user2Email}`,
              lineItemID: chance.guid(),
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 12,
              unitAmount: 10,
              itemCode: CourseWorkbooks.Mandatory,
              description: `Mandatory Course Materials x ${12}`,
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 12,
              unitAmount: 0,
              itemCode: CourseWorkbooks.Free,
              description: `Free Course Materials x ${12}`,
            },
          }),
        ],
      },
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    registrants: [
                      {
                        email: user1Email,
                        xeroLineItemID: invoice.lineItems[0].lineItemID,
                      },
                      { email: user2Email },
                    ],
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  },
                  course: {
                    ...baseCourse,
                    bookingContact: {
                      fullName: chance.name(),
                    },
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }

        if (query === GET_SHALLOW_ATTENDEE_AUDIT_LOGS_QUERY) {
          return fromValue<{ data: GetShallowAttendeeAuditLogsQuery }>({
            data: {
              cancellation: [
                {
                  id: chance.guid(),
                  profile: {
                    id: chance.guid(),
                    fullName: chance.name(),
                    email: user1Email,
                  },
                  xero_invoice_number: invoice.invoiceNumber,
                  course_id: 1,
                },
              ],
              replacement: [],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    const user1Row = screen.getByTestId(`order-registrant-box-0`)
    const user2Row = screen.getByTestId(`order-registrant-box-1`)

    expect(within(user1Row).getByText('Cancelled')).toBeInTheDocument()
    expect(within(user2Row).queryByText('Cancelled')).not.toBeInTheDocument()
  })

  it('renders replaced participant full name and email', () => {
    const user1Email = chance.email()
    const user1FirstName = 'John'
    const user1LastName = 'Trainer'
    const user2Email = chance.email()
    const replacedUserEmail = chance.email()
    const replacedUserFullName = chance.name()
    const unitPrice = 130
    const invoice = buildInvoice({
      overrides: {
        lineItems: [
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: `Level One, ${user1FirstName} ${user1LastName}`,
              lineItemID: chance.guid(),
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: unitPrice,
              description: `Level One, ${user2Email}`,
              lineItemID: chance.guid(),
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 12,
              unitAmount: 10,
              itemCode: CourseWorkbooks.Mandatory,
              description: `Mandatory Course Materials x ${12}`,
            },
          }),
          buildLineItem({
            overrides: {
              quantity: 12,
              unitAmount: 0,
              itemCode: CourseWorkbooks.Free,
              description: `Free Course Materials x ${12}`,
            },
          }),
        ],
      },
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    registrants: [
                      {
                        email: user1Email,
                        xeroLineItemID: invoice.lineItems[0].lineItemID,
                      },
                      { email: user2Email },
                    ],
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: `${user1FirstName} ${user1LastName}`,
                    },
                  },
                  course: {
                    ...baseCourse,
                    bookingContact: {
                      fullName: chance.name(),
                    },
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }

        if (query === GET_SHALLOW_ATTENDEE_AUDIT_LOGS_QUERY) {
          return fromValue<{ data: GetShallowAttendeeAuditLogsQuery }>({
            data: {
              cancellation: [],
              replacement: [
                {
                  id: chance.guid(),
                  profile: {
                    id: chance.guid(),
                    fullName: chance.name(),
                    email: user1Email,
                  },
                  payload: {
                    inviteeEmail: user1Email,
                    inviteeFirstName: user1FirstName,
                    inviteeLastName: user1LastName,
                    invoiceNumber: invoice.invoiceNumber,
                    profile: {
                      id: chance.guid(),
                      fullName: replacedUserFullName,
                      email: replacedUserEmail,
                    },
                  },
                  xero_invoice_number: invoice.invoiceNumber,
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
      </Provider>,
    )

    const user1Row = screen.getByTestId(`order-registrant-0`)
    expect(user1Row.textContent).toContain(
      t('replaced-user', {
        oldUserFullName: replacedUserFullName,
        oldUserEmail: replacedUserEmail,
      }),
    )
  })

  it('renders blended learning licenses information if purchased', () => {
    const unitPrice = 50
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
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    registrants: [],
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  } as unknown as GetCourseOrdersQuery['orders'][0]['order'],
                  quantity: 1,
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
      </Provider>,
    )

    expect(
      screen.getByText(`${formatCurrency(unitPrice)} per attendee`),
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
      error: undefined,
      total: 1,
      mutate: vi.fn(),
      fetching: false,
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  } as unknown as GetCourseOrdersQuery['orders'][0]['order'],
                  quantity: 1,
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
      </Provider>,
    )

    const promoCodeRow = screen.getByTestId('order-promo-code')

    expect(
      within(promoCodeRow).getByText(`Promo code: ${promoCode.code}`),
    ).toBeInTheDocument()
    expect(
      within(promoCodeRow).getByText(formatCurrency(discountAmount)),
    ).toBeInTheDocument()
  })

  it('renders address information for each registrant', () => {
    const orderWithRegistrants = {
      invoice: buildInvoice(),
      registrants: [
        {
          addressLine1: 'Times Square',
          addressLine2: 'Apt 4B',
          city: 'London',
          postCode: 'E1 8GD',
          country: 'England',
        },
      ],
    }

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...orderWithRegistrants,
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  } as unknown as GetCourseOrdersQuery['orders'][0]['order'],
                  quantity: 1,
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
      </Provider>,
    )

    const registrantRows = screen.getAllByTestId('registrants-details')
    expect(registrantRows).toHaveLength(orderWithRegistrants.registrants.length)

    registrantRows.forEach((row, index) => {
      const registrant = orderWithRegistrants.registrants[index]
      const { addressLine1, addressLine2, city, postCode, country } = registrant
      const expectedAddressText = `Address: ${addressLine1}, ${
        addressLine2 ? addressLine2 + ', ' : ''
      }${city}, ${postCode}, ${country}`

      expect(within(row).getByText(expectedAddressText)).toBeInTheDocument()
    })
  })

  it('renders prices and taxes', () => {
    const subtotal = 100
    const vat = 25
    const total = 125
    const paidOnDate = new Date('2023-01-25T08:00:00Z').toISOString()

    const order = buildOrder()
    const invoice = buildInvoice({
      overrides: {
        subtotal,
        total,
        totalTax: vat,
        status: Xero_Invoice_Status_Enum.Paid,
        fullyPaidOnDate: paidOnDate,
        amountDue: String(0),
        amountPaid: String(total),
      },
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  } as unknown as GetCourseOrdersQuery['orders'][0]['order'],
                  quantity: 1,
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
      </Provider>,
    )

    const subTotalRow = screen.getByTestId('order-subtotal')
    const vatRow = screen.getByTestId('order-vat')
    const totalRow = screen.getByTestId('order-total')
    const dueDateRow = screen.getByTestId('order-due-date')
    const paidRow = screen.getByTestId('order-paid-on')
    const amountDueRow = screen.getByTestId('order-amount-due')

    expect(
      within(subTotalRow).getByText(formatCurrency(subtotal)),
    ).toBeInTheDocument()
    expect(within(vatRow).getByText(formatCurrency(vat))).toBeInTheDocument()
    expect(
      within(totalRow).getByText(formatCurrency(total)),
    ).toBeInTheDocument()
    expect(within(dueDateRow).getByText(/paid/i)).toBeInTheDocument()
    expect(
      within(paidRow).getByText(formatCurrency(Number(invoice.amountPaid))),
    ).toBeInTheDocument()
    expect(
      within(amountDueRow).getByText(formatCurrency(Number(invoice.amountDue))),
    ).toBeInTheDocument()
  })

  it('renders payment information', () => {
    const invoice = buildInvoice()

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...baseOrder,
                    invoice,
                    paymentMethod: Payment_Methods_Enum.Cc,
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  } as unknown as GetCourseOrdersQuery['orders'][0]['order'],
                  quantity: 1,
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
      </Provider>,
    )

    expect(screen.getByText(/pay by credit card/i)).toBeInTheDocument()
  })

  it('renders sales person if order is made to a closed course', () => {
    const order = buildOrder()
    const invoice = buildInvoice()

    const salesPerson = chance.name({ full: true })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    salesRepresentative: {
                      id: chance.guid(),
                      fullName: salesPerson,
                    },
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  },
                  course: {
                    ...baseCourse,
                    type: Course_Type_Enum.Closed,
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    expect(screen.getByText(/sales person/i)).toBeInTheDocument()
    expect(screen.getByText(salesPerson)).toBeInTheDocument()
  })

  it('renders invoice to information', () => {
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

    const orderInfo = {
      ...order,
      salesRepresentative: {
        id: chance.guid(),
        fullName: salesPerson,
      },
      invoice: {
        ...invoice,
        contact: {
          ...invoice.contact,
          phones: [
            {
              phoneType: XeroPhoneType.Default,
            },
          ],
        },
      },
      organization: {
        name: chance.name(),
      },
      user: {
        fullName: chance.name(),
      },
      billingGivenName: chance.name(),
      billingFamilyName: chance.name(),
      billingEmail: chance.email(),
      billingPhone: chance.phone(),
      billingAddress: chance.address(),
    }

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...orderInfo,
                    paymentMethod: Payment_Methods_Enum.Invoice,
                  },
                  course: {
                    ...baseCourse,
                    type: Course_Type_Enum.Closed,
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    const invoicedToRow = screen.getByTestId('order-invoiced-to')

    expect(
      within(invoicedToRow).getByText(orderInfo?.organization.name ?? ''),
    ).toBeInTheDocument()

    expect(
      within(invoicedToRow).getByText(
        `${orderInfo?.billingGivenName} ${orderInfo?.billingFamilyName}`,
      ),
    ).toBeInTheDocument()

    expect(
      within(invoicedToRow).getByText(orderInfo?.billingEmail ?? ''),
    ).toBeInTheDocument()

    expect(
      within(invoicedToRow).getByText(orderInfo?.billingPhone ?? ''),
    ).toBeInTheDocument()
    expect(
      within(invoicedToRow).getByTestId('contact-address'),
    ).toHaveTextContent(orderInfo?.billingAddress ?? '')
  })

  it('displays free spaces if applied for the closed course', () => {
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

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  },
                  course: {
                    ...baseCourse,
                    type: Course_Type_Enum.Closed,
                    freeSpaces: 2,
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    const freeSpacesRow = screen.getByTestId('free-spaces-row')

    expect(
      within(freeSpacesRow).getByText('Free spaces x 2'),
    ).toBeInTheDocument()
    expect(
      within(freeSpacesRow).getByText(formatCurrency(discountAmount)),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('order-promo-code')).not.toBeInTheDocument()
  })

  it('renders trainer expenses if found in the invoice line items', () => {
    const expensesLineItems: XeroLineItemSummaryFragment[] = [
      buildLineItem({
        overrides: {
          description: 'Mileage for trainer',
          lineAmount: 50,
        },
      }),
      buildLineItem({
        overrides: {
          description: 'Flight',
          lineAmount: 200,
        },
      }),
    ]

    const order = buildOrder()
    const invoice = buildInvoice({
      overrides: {
        lineItems: [
          buildLineItem({
            overrides: {
              quantity: 1,
              unitAmount: 150,
              description: 'Level One',
            },
          }),
          ...expensesLineItems,
        ],
      },
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice,
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  },
                  course: {
                    ...baseCourse,
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    const expensesRow = screen.getByTestId('expenses-row')

    expensesLineItems.forEach(expense => {
      expect(
        within(expensesRow).getByText(expense.description ?? ''),
      ).toBeInTheDocument()

      expect(
        within(expensesRow).getByText(formatCurrency(expense.lineAmount)),
      ).toBeInTheDocument()
    })
  })

  it('renders course residing country for non UK country', () => {
    const nonUKCountryCode = 'AL'

    const {
      result: {
        current: { getLabel },
      },
    } = renderHook(() => useWorldCountries())

    const order = buildOrder()

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...order,
                    invoice: buildInvoice(),
                    organization: {
                      name: chance.name(),
                    },
                    user: {
                      fullName: chance.name(),
                    },
                  },
                  course: {
                    ...baseCourse,
                    type: Course_Type_Enum.Closed,
                    residingCountry: nonUKCountryCode,
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )

    const regionInfo = screen.getByTestId('region-info')

    expect(within(regionInfo).getByText('-')).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.order-details.residing-country')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(getLabel(nonUKCountryCode) as string),
    ).toBeInTheDocument()
  })
  it('renders timezone details when feature flag is enabled', () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_ORDERS) {
          return fromValue<{ data: GetCourseOrdersQuery }>({
            data: {
              orders: [
                {
                  order: {
                    ...baseOrder,
                    invoice: buildInvoice(),
                  },
                  course: {
                    ...baseCourse,
                  },
                  quantity: 1,
                },
              ] as unknown as GetCourseOrdersQuery['orders'],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrderDetails />
      </Provider>,
    )
    expect(
      screen.getByTestId('order-course-title').textContent,
    ).toMatchInlineSnapshot(`"Level One "`)
    expect(
      screen.getByTestId('order-timezone-info').textContent,
    ).toMatchInlineSnapshot(
      `"${format(
        new Date(courseStartDate),
        'd MMMM yyyy, hh:mm a',
      )} ${formatGMTDateTimeByTimeZone(
        courseStartDate,
        baseCourse.schedule[0].timezone,
        false,
      )} - ${format(
        new Date(courseEndDate),
        'd MMMM yyyy, hh:mm a',
      )} ${formatGMTDateTimeByTimeZone(
        courseStartDate,
        baseCourse.schedule[0].timezone,
        true,
      )}"`,
    )
  })
})
