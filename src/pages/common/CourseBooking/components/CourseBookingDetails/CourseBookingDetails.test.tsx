import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { Course } from '@app/types'

import { render } from '@test/index'

import { useBooking } from '../BookingContext'

import { CourseBookingDetails } from './CourseBookingDetails'

jest.mock('../BookingContext', () => ({
  useBooking: jest.fn(),
}))

const useBookingMock = jest.mocked(useBooking)

describe('CourseBookingDetails', () => {
  useBookingMock.mockReturnValue({
    course: {
      name: 'My Course 1',
      dates: {
        aggregate: {
          start: { date: new Date('2022-04-10T10:00:00').toISOString() },
          end: { date: new Date('2022-04-10T12:00:00').toISOString() },
        },
      },
    } as Course,
    addPromo: jest.fn(),
    removePromo: jest.fn(),
    booking: {
      emails: [],
      price: 20,
      promoCodes: [],
      quantity: 3,
      vat: 10,
    },
    availableSeats: 5,
    ready: true,
    setBooking: jest.fn(),
    totalPrice: 45,
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
