import { t } from 'i18next'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseWaitlist } from './CourseWaitlist'

jest.mock('@app/hooks/useCourse')

const useCourseMocked = jest.mocked(useCourse)

describe('CourseWaitlistPage', () => {
  it('matches snapshot', async () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.IDLE,
      data: undefined,
      mutate: jest.fn(),
    })

    const view = render(
      <MemoryRouter initialEntries={['/waitlist?course_id=10000']}>
        <Routes>
          <Route path="/waitlist" element={<CourseWaitlist />} />
        </Routes>
      </MemoryRouter>
    )

    expect(view).toMatchSnapshot()
  })

  it('displays course details', async () => {
    const course = buildCourse()
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/waitlist?course_id=10000']}>
        <Routes>
          <Route path="/waitlist" element={<CourseWaitlist />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    const {
      schedule: [
        {
          start = '',
          venue: {
            name = '',
            addressLineOne = '',
            city = '',
            postCode = '',
          } = {},
        },
      ] = [],
    } = course
    const startEndTimes = `${t('dates.withTime', {
      date: start,
    })}`
    expect(screen.getAllByText(startEndTimes)).toHaveLength(2)
    expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.getByText(addressLineOne)).toBeInTheDocument()
    expect(screen.getByText(`${city}, ${postCode}`)).toBeInTheDocument()
  })
})
