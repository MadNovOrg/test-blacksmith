import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import { Course_Type_Enum } from '@app/generated/graphql'
import { QUERY as GET_FEEDBACK_USERS_QUERY } from '@app/queries/course-evaluation/get-feedback-users'
import { GET_PARTICIPANT } from '@app/queries/participants/get-course-participant-by-profile-id'
import { QUERY as GET_COURSE_QUERY } from '@app/queries/user-queries/get-course-by-id'
import { Course, CourseParticipant, RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildEndedCourse,
  buildNotStartedCourse,
  buildParticipant,
  buildStartedCourse,
} from '@test/mock-data-utils'

import { CourseDetails } from './CourseDetails'

export type SpecCourseType = {
  course: Course
  courseParticipants?: CourseParticipant[]
  orgMembers?: { profile_id: string; isAdmin: boolean }[]
}
export const getURQLMockClient: (data: SpecCourseType) => Client = ({
  course,
  courseParticipants,
  orgMembers,
}) => {
  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      switch (query) {
        case GET_COURSE_QUERY:
          return fromValue({
            data: {
              course: {
                ...course,
                organization: { members: orgMembers ?? [] },
                participants: courseParticipants ?? [buildParticipant()],
              },
            },
          })
        case GET_PARTICIPANT:
          return fromValue({
            data: {
              course_participant: courseParticipants ?? [buildParticipant()],
            },
          })
        case GET_FEEDBACK_USERS_QUERY:
          return fromValue({ data: { users: [] } })
        default:
          fromValue({ data: {} })
      }
    },
  }
  return client as unknown as Client
}

const MockedCourseDetails: FC<SpecCourseType> = data => {
  return (
    <Provider value={getURQLMockClient(data)}>
      <CourseDetails />
    </Provider>
  )
}

describe(CourseDetails.name, () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('correctly displays *Change my attendance* modal title', async () => {
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
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
    const user = userEvent.setup()

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={<MockedCourseDetails course={course} />}
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
    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={<MockedCourseDetails course={course} />}
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
    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={<MockedCourseDetails course={course} />}
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
    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={<MockedCourseDetails course={course} />}
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

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={<MockedCourseDetails course={course} />}
        />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(
      screen.getByRole('button', { name: /available after course/i })
    ).toBeDisabled()
  })

  it('has course evaluation button disabled if not the last day of the course', () => {
    vi.setSystemTime(new Date('2024-03-01T10:00:00'))

    const course = buildStartedCourse({
      overrides: {
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: new Date('2024-03-01T09:00:00').toISOString(),
              end: new Date('2024-03-02T17:00:00').toISOString(),
            },
          }),
        ],
      },
    })

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={<MockedCourseDetails course={course} />}
        />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(
      screen.getByRole('button', { name: /available after course/i })
    ).toBeDisabled()
  })

  it("has course evaluation button enabled if it's the last day of the course", async () => {
    vi.setSystemTime(new Date('2024-03-02T09:01:00'))

    const course = buildStartedCourse({
      overrides: {
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: new Date('2024-03-01T09:00:00').toISOString(),
              end: new Date('2024-03-02T17:00:00').toISOString(),
            },
          }),
        ],
      },
    })

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              course={course}
              courseParticipants={[{ ...buildParticipant(), attended: true }]}
            />
          }
        />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /evaluate course/i })
      ).toBeEnabled()
    })
  })

  it('has course evaluation button enabled if on the day course starts when course starts and ends in the same day', async () => {
    vi.setSystemTime(new Date('2024-03-02T09:01:00'))

    const course = buildStartedCourse({
      overrides: {
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: new Date('2024-03-01T09:00:00').toISOString(),
              end: new Date('2024-03-01T17:00:00').toISOString(),
            },
          }),
        ],
      },
    })

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              course={course}
              courseParticipants={[{ ...buildParticipant(), attended: true }]}
            />
          }
        />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /evaluate course/i })
      ).toBeEnabled()
    })
  })

  it("disables evaluation button if course has ended but the participant didn't attend the course", () => {
    const course = buildEndedCourse()
    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              courseParticipants={[{ ...buildParticipant(), attended: false }]}
              course={course}
            />
          }
        />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(
      screen.getByRole('button', { name: /evaluate course/i })
    ).toBeDisabled()
  })

  it('displays button to manage course if a participant is also an org admin', async () => {
    const PROFILE_ID = chance.guid()
    const course = buildCourse()

    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              course={course}
              courseParticipants={[{ ...buildParticipant(), attended: false }]}
              orgMembers={[{ profile_id: PROFILE_ID, isAdmin: true }]}
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

  it('disables the evaluation button and shows helper text if the participant has not submitted the health and safety form', async () => {
    const course = buildEndedCourse()
    render(
      <Routes>
        <Route
          path={`/courses/:id/details`}
          element={
            <MockedCourseDetails
              courseParticipants={[
                {
                  ...buildParticipant(),
                  attended: true,
                  healthSafetyConsent: false,
                },
              ]}
              course={course}
            />
          }
        />
      </Routes>,
      {},
      { initialEntries: [`/courses/${course.id}/details`] }
    )

    expect(
      screen.getByRole('button', { name: /evaluate course/i })
    ).toBeDisabled()

    expect(
      screen.getByText(/Please submit the Health & Safety Consent Form first/i)
    ).toBeInTheDocument()
  })
})
