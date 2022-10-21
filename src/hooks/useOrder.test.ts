import { renderHook } from '@testing-library/react-hooks'
import { addWeeks } from 'date-fns'
import useSWR from 'swr'

import { chance } from '@test/index'

import { useOrder } from './useOrder'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = {
  data: undefined,
  mutate: jest.fn(),
  isValidating: false,
}

const date = chance.date()
const total = chance.integer({ min: 100, max: 99999 })

const mockedCourse = {
  id: chance.integer({ min: 10100, max: 10999 }),
  name: chance.sentence({ words: 3 }),
}

const mockedOrder = {
  id: chance.guid(),
  courseId: mockedCourse.id,
  profileId: chance.guid(),
  quantity: 1,
  registrants: [chance.email()],
  paymentMethod: 'INVOICE',
  orderDue: total,
  orderTotal: total,
  currency: 'GBP',
  stripePaymentId: null,
  promoCodes: [],
  xeroInvoiceNumber: 'INV-0001',
}

const mockedInvoice = {
  url: chance.url(),
  type: 'DRAFT',
  date,
  total: mockedOrder.orderTotal,
  status: 'AWAITING_PAYMENT',
  contact: {
    contactID: chance.guid(),
    name: chance.name(),
    emailAddress: chance.email(),
    phones: [
      {
        phoneCountryCode: '44',
        phoneAreaCode: '111',
        phoneNumber: '1111111',
      },
    ],
    addresses: [
      {
        addressLine1: chance.street(),
        addressLine2: chance.sentence({ words: 3 }),
        city: chance.city(),
        region: chance.province({ full: true }),
        postalCode: chance.postcode(),
        country: chance.country({ full: true }),
      },
    ],
  },
  dueDate: addWeeks(date, 8),
  subtotal: mockedOrder.orderTotal,
  totalTax: 0,
  invoiceID: chance.guid(),
  amountDue: mockedOrder.orderDue,
  lineItems: [
    {
      description: `${mockedCourse.name}, ${mockedOrder.registrants[0]}`,
      quantity: 1,
      unitAmount: mockedOrder.orderTotal,
      taxAmount: 0,
      lineAmount: mockedOrder.orderTotal,
      discountRate: 0,
    },
  ],
  reference: mockedOrder.courseId,
  amountPaid: 0,
  currencyCode: 'GBP',
  invoiceNumber: 'INV-0001',
  totalDiscount: 0,
  fullyPaidOnDate: null,
}

describe('useOrder', () => {
  it('should return no data for invalid order id', async () => {
    useSWRMock.mockReturnValue(useSWRMockDefaults)

    const orderId = chance.guid()
    const { result } = renderHook(() => useOrder(orderId))
    const { order, course, invoice } = result.current

    expect(order).toStrictEqual({})
    expect(course).toStrictEqual({})
    expect(invoice).toStrictEqual({})

    expect(useSWRMock).toBeCalledWith([expect.any(String), { orderId }])
  })

  it('should return expected data for valid order id', async () => {
    useSWRMock.mockReturnValueOnce({
      ...useSWRMockDefaults,
      data: { order: mockedOrder },
    })

    useSWRMock.mockReturnValueOnce({
      ...useSWRMockDefaults,
      data: { invoices: [mockedInvoice] },
    })

    useSWRMock.mockReturnValueOnce({
      ...useSWRMockDefaults,
      data: { course: mockedCourse },
    })

    const orderId = mockedOrder.id
    const { result } = renderHook(() => useOrder(orderId))
    const { order, course, invoice } = result.current

    expect(order).toStrictEqual(mockedOrder)
    expect(course).toStrictEqual(mockedCourse)
    expect(invoice).toStrictEqual(mockedInvoice)

    expect(useSWRMock).toBeCalledWith([
      expect.any(String),
      { invoiceNumbers: [mockedOrder.xeroInvoiceNumber] },
    ])
  })
})
