import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import { Course_Type_Enum } from '@app/generated/graphql'
import { QUERY as GET_FEEDBACK_USERS_QUERY } from '@app/queries/course-evaluation/get-feedback-users'
import { GetParticipant } from '@app/queries/participants/get-course-participant-by-profile-id'
import { QUERY as GET_COURSE_QUERY } from '@app/queries/user-queries/get-course-by-id'
import { Course, CourseParticipant, RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'
import {
  buildCourse,
  buildEndedCourse,
  buildNotStartedCourse,
  buildParticipant,
  buildStartedCourse,
} from '@test/mock-data-utils'

import { CourseDetails } from '.'

type SpecCourseType = {
  course: Course
  courseParticipants?: CourseParticipant[]
  orgMembers?: { profile_id: string; isAdmin: boolean }[]
}
const getURQLMockClient: (data: SpecCourseType) => Client = ({
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
        case GetParticipant:
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

    expect(screen.getByTestId('evaluate-course-cta')).toBeDisabled()
  })

  it('has course evaluation button enabled if course has started', async () => {
    const course = buildStartedCourse()
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
      expect(screen.getByTestId('evaluate-course-cta')).toBeEnabled()
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

    expect(screen.getByTestId('evaluate-course-cta')).toBeDisabled()
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
})
