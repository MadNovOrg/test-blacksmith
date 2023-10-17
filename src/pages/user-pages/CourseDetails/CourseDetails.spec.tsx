import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import useSWR from 'swr'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { Course, CourseParticipant, CourseType, RoleName } from '@app/types'

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

type SpecCourseType = {
  data: {
    course: Course
    courseParticipants?: CourseParticipant[]
    orgMembers?: { profile_id: string; isAdmin: boolean }[]
  }
}

const urqlMockClient = (data: SpecCourseType) =>
  ({
    executeQuery: () => fromValue(data),
  } as unknown as Client)

const MockedCourseDetails: FC<SpecCourseType> = ({ data }) => {
  return (
    <Provider value={urqlMockClient({ data })}>
      <CourseDetails />
    </Provider>
  )
}

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
  it('correctly displays *Change my attendance* modal title', async () => {
    const course = buildCourse.one({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          {
            id: chance.guid(),
            createdAt: new Date(chance.date({ year: 2025 })).toISOString(),
            start: new Date(chance.date({ year: 2025 })).toISOString(),
            end: new Date(chance.date({ year: 2025 })).toISOString(),
            virtualLink: chance.url(),
          },
        ],
      },
    })
    registerMocks(course)

    const user = userEvent.setup()

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
              }}
            />
          }
        />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    const changeMyAttendanceBtn = screen.getByTestId('change-my-attendance-btn')

    await user.click(changeMyAttendanceBtn)

    expect(
      screen.getByTestId('change-my-attendance-modal-title')
    ).toHaveTextContent('Change my attendance')
  })

  it('displays course hero info', () => {
    const course = buildCourse()
    registerMocks(course)

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
              }}
            />
          }
        />
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
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
              }}
            />
          }
        />
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
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
              }}
            />
          }
        />
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
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
              }}
            />
          }
        />
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
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
                courseParticipants: [{ ...buildParticipant(), attended: true }],
              }}
            />
          }
        />
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
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
                courseParticipants: [
                  { ...buildParticipant(), attended: false },
                ],
              }}
            />
          }
        />
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
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              data={{
                course,
                courseParticipants: [
                  { ...buildParticipant(), attended: false },
                ],
                orgMembers: [{ profile_id: PROFILE_ID, isAdmin: true }],
              }}
            />
          }
        />
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
          isOrgAdmin: true,
          allowedRoles: new Set([RoleName.USER]),
          activeRole: RoleName.USER,
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
