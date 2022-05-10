import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { useFetcher } from '@app/hooks/use-fetcher'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { MUTATION } from '@app/queries/courses/save-course-attendance'
import { LoadingStatus } from '@app/util'

import { render, screen, waitForText, within } from '@test/index'
import { buildParticipant } from '@test/mock-data-utils'

import { CourseAttendance } from './index'

jest.mock('@app/hooks/useCourseParticipants')
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: jest.fn(),
}))

const useCourseParticipantsMocked = jest.mocked(useCourseParticipants)
const useFetcherMock = jest.mocked(useFetcher)

describe('component: CourseAttendance', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays spinner while loading for participants', () => {
    const COURSE_ID = 'course-id'

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseAttendance />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('participants-fetching')).toBeInTheDocument()
  })

  it('displays course participants', () => {
    const COURSE_ID = 'course-id'
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseAttendance />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.queryByTestId('participants-fetching')
    ).not.toBeInTheDocument()

    participants.forEach(participant => {
      expect(
        screen.getByText(`${participant.profile.fullName}`)
      ).toBeInTheDocument()
    })
  })

  it('displays save attendance for participant if no local storage backup', () => {
    const COURSE_ID = 'course-id'
    const participants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseAttendance />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    expect(
      within(
        screen.getByTestId(`participant-attendance-${participants[0].id}`)
      ).getByText('Did not attend')
    ).toBeInTheDocument()

    expect(
      within(
        screen.getByTestId(`participant-attendance-${participants[1].id}`)
      ).getByText('Attended + ID checked')
    ).toBeInTheDocument()

    expect(
      within(
        screen.getByTestId(`participant-attendance-${participants[2].id}`)
      ).getByText('Attended + ID checked')
    ).toBeInTheDocument()
  })

  it('saves to local storage when attendance changes', () => {
    const COURSE_ID = 'course-id'
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseAttendance />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    )

    const storedAttendance = localStorage.getItem(
      `course-attendance-${COURSE_ID}`
    )

    expect(JSON.parse(storedAttendance ?? '')).toEqual({
      [participants[1].id]: true,
      [participants[2].id]: true,
      [participants[0].id]: false,
    })
  })

  it('displays attendance from local storage if it exists for the course', () => {
    const COURSE_ID = 'course-id'
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
    })

    localStorage.setItem(
      `course-attendance-${COURSE_ID}`,
      JSON.stringify({
        [participants[0].id]: false,
        [participants[1].id]: true,
        [participants[2].id]: true,
      })
    )

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseAttendance />}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    ).not.toBeChecked()
    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('saves course attendance', async () => {
    const fetcherMock = jest.fn()

    useFetcherMock.mockReturnValue(fetcherMock)

    const COURSE_ID = 'course-id'
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
    })

    render(
      <MemoryRouter initialEntries={[`/${COURSE_ID}/grading-details`]}>
        <Routes>
          <Route
            path="/:id/grading-details"
            element={<CourseAttendance />}
          ></Route>
          <Route
            path="/:id/grading-details/modules"
            element={<h3>Modules page</h3>}
          ></Route>
        </Routes>
      </MemoryRouter>
    )

    userEvent.click(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    )

    userEvent.click(screen.getByText('Next: Confirm modules and techniques'))

    expect(fetcherMock).toBeCalledTimes(1)
    expect(fetcherMock.mock.calls[0]).toEqual([
      MUTATION,
      {
        attended: [participants[1].id, participants[2].id],
        notAttended: [participants[0].id],
      },
    ])

    await waitForText('Modules page')

    expect(localStorage.getItem(`course-attendance-${COURSE_ID}`)).toBeNull()
  })
})
