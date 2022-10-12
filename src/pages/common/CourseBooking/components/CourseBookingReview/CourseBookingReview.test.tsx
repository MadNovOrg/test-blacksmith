import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { PaymentMethod } from '@app/generated/graphql'
import { CourseType, Currency } from '@app/types'

import { render } from '@test/index'

import { useBooking, ContextType } from '../BookingContext'
import { positions, sectors } from '../org-data'

import { CourseBookingReview } from './CourseBookingReview'

jest.mock('../BookingContext', () => ({
  useBooking: jest.fn(),
}))

const useBookingMock = jest.mocked(useBooking)

const currency = Currency.GBP
const price = 20
const vat = 10

const getMockData = (
  type: CourseType,
  quantity: number,
  freeSpaces = 0,
  trainerExpenses = 0
) => {
  const subtotal = price * quantity
  const discount = 0
  const freeSpacesDiscount = price * freeSpaces
  const subtotalDiscounted = subtotal - discount - freeSpacesDiscount
  const vatAmount = (vat / 100) * subtotalDiscounted
  const total = subtotalDiscounted + vatAmount + trainerExpenses

  return {
    course: {
      id: 11,
      name: 'My Course 1',
      dates: {
        aggregate: {
          start: { date: new Date('2022-04-10T10:00:00').toISOString() },
          end: { date: new Date('2022-04-10T12:00:00').toISOString() },
        },
      },
      maxParticipants: 12,
      participants: { aggregate: { count: 12 - quantity } },
      type,
      freeSpaces,
    },
    addPromo: jest.fn(),
    removePromo: jest.fn(),
    booking: {
      emails: [],
      price,
      currency,
      promoCodes: [],
      discounts: {},
      quantity,
      vat,
      orgId: '',
      sector: '',
      position: '',
      otherPosition: '',
      paymentMethod: PaymentMethod.Invoice,
      courseType: type,
      freeSpaces,
      trainerExpenses,
    },
    positions,
    sectors,
    availableSeats: quantity,
    ready: true,
    setBooking: jest.fn(),
    amounts: {
      courseCost: subtotal,
      freeSpacesDiscount,
      subtotal,
      discount,
      subtotalDiscounted,
      vat: vatAmount,
      total,
      trainerExpenses,
      paymentProcessingFee: 0,
    },
    placeOrder: jest.fn(),
    orderId: null,
    error: null,
  } as ContextType
}

describe('CourseBookingReview', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('matches snapshot for OPEN course', async () => {
    useBookingMock.mockReturnValueOnce(getMockData(CourseType.OPEN, 3))

    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CourseBookingReview />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })

  it('matches snapshot for CLOSED course', async () => {
    useBookingMock.mockReturnValueOnce(
      getMockData(CourseType.CLOSED, 12, 2, 721.5)
    )

    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CourseBookingReview />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
