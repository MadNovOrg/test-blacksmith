import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { render, screen } from '@test/index'
import {
  buildCourse,
  buildEndedCourse,
  buildNotStartedCourse,
  buildParticipant,
} from '@test/mock-data-utils'

import { CourseDetails } from '.'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)

describe('page: CourseDetails', () => {
  it('displays course hero info', () => {
    const course = buildCourse()

    useSWRMock.mockReturnValueOnce({
      data: { course },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { course_participant: [buildParticipant()] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    expect(
      screen.getByLabelText('You are attending this course')
    ).toBeInTheDocument()
    expect(screen.queryByTestId('success-alert')).not.toBeInTheDocument()
  })

  it('displays an alert if user has been redirected from accepting the invite', () => {
    const course = buildCourse()
    useSWRMock.mockReturnValueOnce({
      data: { course },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { course_participant: [buildParticipant()] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <MemoryRouter
        initialEntries={[
          `/courses/${course.id}/details?success=invite_accepted`,
        ]}
      >
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('success-alert')).toBeInTheDocument()
  })

  it('displays tabs with course checklist and resources', () => {
    const course = buildCourse()
    useSWRMock.mockReturnValueOnce({
      data: { course },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { course_participant: [buildParticipant()] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Course participant tabs')).toBeInTheDocument()
    expect(screen.getByLabelText('Course checklist')).toBeInTheDocument()
    expect(screen.getByLabelText('Resources')).toBeInTheDocument()
  })

  it('has course evaluation button disabled if course has not started yet', () => {
    const course = buildNotStartedCourse()
    useSWRMock.mockReturnValueOnce({
      data: { course },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { course_participant: [buildParticipant()] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('evaluate-course-cta')).toBeDisabled()
  })

  it('has course evaluation button enabled if course has ended', () => {
    const course = buildEndedCourse()
    useSWRMock.mockReturnValueOnce({
      data: { course },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { course_participant: [buildParticipant()] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('evaluate-course-cta')).toBeEnabled()
  })
})
