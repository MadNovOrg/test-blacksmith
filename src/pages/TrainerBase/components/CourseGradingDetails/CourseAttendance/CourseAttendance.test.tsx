import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useFetcher } from '@app/hooks/use-fetcher'

import { CourseAttendance } from './index'

import { LoadingStatus } from '@app/util'
import { render, screen, waitForText } from '@test/index'
import { buildParticipant, buildProfile } from '@test/mock-data-utils'
import { CourseParticipant } from '@app/types'
import { MUTATION } from '@app/queries/courses/save-course-attendance'

jest.mock('@app/hooks/useCourseParticipants')
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: jest.fn(),
}))

const useCourseParticipantsMocked = jest.mocked(useCourseParticipants)
const useFetcherMock = jest.mocked(useFetcher)

function buildParticipants(): CourseParticipant[] {
  return [
    buildParticipant({
      overrides: {
        profile: buildProfile(),
      },
    }),
    buildParticipant({
      overrides: {
        profile: buildProfile(),
      },
    }),
    buildParticipant({
      overrides: {
        profile: buildProfile(),
      },
    }),
  ]
}

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
    const participants = buildParticipants()

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
        screen.getByText(
          `${participant.profile.givenName} ${participant.profile.familyName}`
        )
      ).toBeInTheDocument()
    })
  })

  it('saves to local storage when attendance changes', () => {
    const COURSE_ID = 'course-id'
    const participants = buildParticipants()

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
    const participants = buildParticipants()

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
    const participants = buildParticipants()

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

    userEvent.click(screen.getByText('Next: Confirm modules and holds'))

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
