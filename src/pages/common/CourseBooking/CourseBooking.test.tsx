import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { render } from '@test/index'

import { CourseBookingPage } from './CourseBooking'

describe('CourseBookingPage', () => {
  it('matches snapshot', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CourseBookingPage />} />
          <Route path="/review" element={<div>Review Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
