import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { render } from '@test/index'

import { CourseBookingReviewPage } from './CourseBookingReview'

describe('CourseBookingReviewPage', () => {
  it('matches snapshot', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CourseBookingReviewPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
