import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { PaymentMethod } from '@app/types'

import { render } from '@test/index'

import { useBooking } from '../BookingContext'
import { positions, sectors } from '../org-data'

import { CourseBookingDetails } from './CourseBookingDetails'

jest.mock('../BookingContext', () => ({
  useBooking: jest.fn(),
}))

jest.mock('@app/components/OrgSelector', () => ({
  OrgSelector: jest.fn().mockReturnValue(<div />),
}))

const useBookingMock = jest.mocked(useBooking)

describe('CourseBookingDetails', () => {
  useBookingMock.mockReturnValue({
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
      participants: { aggregate: { count: 3 } },
    },
    addPromo: jest.fn(),
    removePromo: jest.fn(),
    booking: {
      emails: [],
      price: 20,
      promoCodes: [],
      quantity: 3,
      vat: 10,
      orgId: '',
      sector: '',
      position: '',
      otherPosition: '',
      paymentMethod: PaymentMethod.INVOICE,
    },
    positions,
    sectors,
    availableSeats: 5,
    ready: true,
    setBooking: jest.fn(),
    totalPrice: 45,
    placeOrder: jest.fn(),
    orderId: null,
  })

  it('matches snapshot', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CourseBookingDetails />} />
          <Route path="/review" element={<div>Review Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
