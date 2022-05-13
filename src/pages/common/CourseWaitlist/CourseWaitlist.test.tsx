import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { render } from '@test/index'

import { CourseWaitlist } from './CourseWaitlist'

describe('CourseWaitlistPage', () => {
  it('matches snapshot', async () => {
    const view = render(
      <MemoryRouter initialEntries={['/waitlist?course_id=10000']}>
        <Routes>
          <Route path="/waitlist" element={<CourseWaitlist />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })
})
