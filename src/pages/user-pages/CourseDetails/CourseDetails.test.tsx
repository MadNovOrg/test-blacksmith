import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { Course } from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'
import {
  buildCourse,
  buildEndedCourse,
  buildNotStartedCourse,
  buildParticipant,
  buildStartedCourse,
} from '@test/mock-data-utils'

import { CourseDetails } from '.'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)

function registerMocks(course: Course) {
  useSWRMock.mockReturnValueOnce({
    data: { course: { ...course, organization: { members: [] } } },
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
  useSWRMock.mockReturnValueOnce({
    data: { certificates: [], upcomingCourses: [] },
    mutate: jest.fn(),
    isValidating: false,
  })
}

describe('page: CourseDetails', () => {
  it('displays course hero info', () => {
    const course = buildCourse()
    registerMocks(course)

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    expect(screen.queryByTestId('success-alert')).not.toBeInTheDocument()
  })

  it('displays an alert if user has been redirected from accepting the invite', () => {
    const course = buildCourse()
    registerMocks(course)

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
    registerMocks(course)

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Course participant tabs')).toBeInTheDocument()
    expect(screen.getByLabelText('Checklist')).toBeInTheDocument()
    expect(screen.getByLabelText('Resources')).toBeInTheDocument()
  })

  it('has course evaluation button disabled if course has not started yet', () => {
    const course = buildNotStartedCourse()
    registerMocks(course)

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('evaluate-course-cta')).toBeDisabled()
  })

  it('has course evaluation button enabled if course has started', () => {
    const course = buildStartedCourse()

    useSWRMock.mockReturnValueOnce({
      data: { course: { ...course, organization: { members: [] } } },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: {
        course_participant: [{ ...buildParticipant(), attended: true }],
      },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { certificates: [], upcomingCourses: [] },
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

  it("disables evaluation button if course has ended but the participant didn't attend the course", () => {
    const course = buildEndedCourse()

    useSWRMock.mockReturnValueOnce({
      data: { course: { ...course, organization: { members: [] } } },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: {
        course_participant: [{ ...buildParticipant(), attended: false }],
      },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { certificates: [], upcomingCourses: [] },
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

  it('displays button to manage course if a participant is also an org admin', async () => {
    const PROFILE_ID = chance.guid()
    const course = buildCourse()

    useSWRMock.mockReturnValueOnce({
      data: {
        course: {
          ...course,
          organization: {
            members: [{ profile_id: PROFILE_ID, isAdmin: true }],
          },
        },
      },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: {
        course_participant: [{ ...buildParticipant(), attended: false }],
      },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { users: [] },
      mutate: jest.fn(),
      isValidating: false,
    })
    useSWRMock.mockReturnValueOnce({
      data: { certificates: [], upcomingCourses: [] },
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <MemoryRouter initialEntries={[`/courses/${course.id}/details`]}>
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
          <Route
            path={`/manage-courses/:orgId/:id/details`}
            element={<p>Manage course page</p>}
          />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          profile: {
            id: PROFILE_ID,
          },
        },
      }
    )

    userEvent.click(screen.getByText(/manage course/i))

    await waitFor(() => {
      expect(screen.getByText(/manage course page/i)).toBeInTheDocument()
    })
  })
})
