import React from 'react'
import { Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { Course, CourseParticipant } from '@app/types'

import {
  chance,
  render,
  screen,
  userEvent,
  useSWRDefaultResponse,
  waitFor,
} from '@test/index'
import {
  buildCourse,
  buildEndedCourse,
  buildNotStartedCourse,
  buildParticipant,
  buildStartedCourse,
} from '@test/mock-data-utils'

import { CourseDetails } from '.'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

function registerMocks(
  course: Course,
  courseParticipants?: CourseParticipant[],
  orgMembers?: { profile_id: string; isAdmin: boolean }[]
) {
  useSWRMock.mockImplementation(key => {
    if (!key || typeof key !== 'object') return useSWRDefaultResponse
    let data = null
    if (key[0].includes('GetUserCourseById')) {
      data = {
        course: {
          ...course,
          organization: { members: orgMembers ?? [] },
          participants: courseParticipants,
        },
      }
    } else if (key[0].includes('GetCourseParticipantId')) {
      data = { course_participant: courseParticipants ?? [buildParticipant()] }
    } else if (key[0].includes('GetFeedbackUsers')) {
      data = { users: [] }
    } else if (key[0].includes('GetProfileDetails')) {
      data = { certificates: [], upcomingCourses: [] }
    }
    return {
      ...useSWRDefaultResponse,
      data,
    }
  })
}

describe('page: CourseDetails', () => {
  it('displays course hero info', () => {
    const course = buildCourse()
    registerMocks(course)

    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    expect(screen.queryByTestId('success-alert')).not.toBeInTheDocument()
  })

  it('displays an alert if user has been redirected from accepting the invite', () => {
    const course = buildCourse()
    registerMocks(course)

    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
      </Routes>,
      {},
      {
        initialEntries: [
          `/courses/${course.id}/details?success=invite_accepted`,
        ],
      }
    )

    expect(screen.getByTestId('success-alert')).toBeInTheDocument()
  })

  it('displays tabs with course checklist and resources', () => {
    const course = buildCourse()
    registerMocks(course)

    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(screen.getByLabelText('Course participant tabs')).toBeInTheDocument()
    expect(screen.getByLabelText('Checklist')).toBeInTheDocument()
  })

  it('has course evaluation button disabled if course has not started yet', () => {
    const course = buildNotStartedCourse()
    registerMocks(course)

    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(screen.getByTestId('evaluate-course-cta')).toBeDisabled()
  })

  it('has course evaluation button enabled if course has started', async () => {
    const course = buildStartedCourse()
    registerMocks(course, [{ ...buildParticipant(), attended: true }])

    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    await waitFor(() => {
      expect(screen.getByTestId('evaluate-course-cta')).toBeEnabled()
    })
  })

  it("disables evaluation button if course has ended but the participant didn't attend the course", () => {
    const course = buildEndedCourse()
    registerMocks(course, [{ ...buildParticipant(), attended: false }])

    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(screen.getByTestId('evaluate-course-cta')).toBeDisabled()
  })

  it('displays button to manage course if a participant is also an org admin', async () => {
    const PROFILE_ID = chance.guid()
    const course = buildCourse()
    registerMocks(
      course,
      [{ ...buildParticipant(), attended: false }],
      [{ profile_id: PROFILE_ID, isAdmin: true }]
    )

    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        <Route
          path={`/manage-courses/:orgId/:id/details`}
          element={<p>Manage course page</p>}
        />
      </Routes>,
      {
        auth: {
          profile: {
            id: PROFILE_ID,
          },
        },
      },
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    await userEvent.click(screen.getByText(/manage course/i))

    await waitFor(() => {
      expect(screen.getByText(/manage course page/i)).toBeInTheDocument()
    })
  })
})
