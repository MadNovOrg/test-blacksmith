import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { render } from '@test/index'

import { CourseBookingDone } from './CourseBookingDone'

describe('CourseBookingDone', () => {
  it('matches snapshot', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CourseBookingDone />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
