import userEvent from '@testing-library/user-event'
import { addHours } from 'date-fns/esm'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { describe } from 'vitest'
import { fromValue } from 'wonka'

import {
  Course_Status_Enum,
  UserCoursesQuery,
  UserCoursesQueryVariables,
} from '@app/generated/graphql'
import { ManageContactRoleCourses } from '@app/pages/user-pages/MyCourses/ManageContactRoleCourses'
import { buildUserCourse } from '@app/pages/user-pages/MyCourses/test-utils'
import {
  AdminOnlyCourseStatus,
  AttendeeOnlyCourseStatus,
  RoleName,
} from '@app/types'

import { render, renderHook, screen, within } from '@test/index'

describe('Booking contact and Org key contact manage courses page', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it.each([
    AdminOnlyCourseStatus.CancellationRequested,
    AttendeeOnlyCourseStatus.AwaitingGrade,
    Course_Status_Enum.Cancelled,
    Course_Status_Enum.Completed,
    Course_Status_Enum.Scheduled,
  ])(
    'display status filter %s for booking contact and org key contact',
    async status => {
      render(<ManageContactRoleCourses />, {
        auth: { activeRole: RoleName.BOOKING_CONTACT },
      })

      const statusFilter = screen.getByTestId('FilterByCourseStatus')
      await userEvent.click(statusFilter)

      expect(
        within(statusFilter).getByText(t(`course-statuses.${status}`))
      ).toBeInTheDocument()
    }
  )

  it('display cancel requested courses for booking contact and org key contact', async () => {
    const course = buildUserCourse()
    course.cancellationRequest = { id: 'id' }

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]._or ?? [{}] : [{}]

        const cancelRequestCondition =
          orCondition[0]?.cancellationRequest?.id?._is_null === false

        const courses = cancelRequestCondition ? [course] : []

        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses,
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <ManageContactRoleCourses />
      </Provider>,
      { auth: { activeRole: RoleName.BOOKING_CONTACT } }
    )

    const statusFilter = screen.getByTestId('FilterByCourseStatus')
    await userEvent.click(statusFilter)

    await userEvent.click(
      within(statusFilter).getByText(
        t(`course-statuses.${AdminOnlyCourseStatus.CancellationRequested}`)
      )
    )

    expect(screen.getByTestId(`course-row-${course.id}`)).toBeInTheDocument()

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        t(`course-statuses.${AdminOnlyCourseStatus.CancellationRequested}`)
      )
    ).toBeInTheDocument()
  })

  it('display cancelled courses for booking contact and org key contact', async () => {
    const courses = [
      buildUserCourse({
        overrides: {
          status: Course_Status_Enum.Cancelled,
        },
      }),
      buildUserCourse({
        overrides: {
          status: Course_Status_Enum.Declined,
        },
      }),
    ]

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]._or ?? [{}] : [{}]

        const cancelledCondition =
          orCondition[0]?.status?._in?.includes(Course_Status_Enum.Cancelled) &&
          orCondition[0]?.status?._in?.includes(Course_Status_Enum.Declined)

        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: cancelledCondition ? courses : [],
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <ManageContactRoleCourses />
      </Provider>,
      { auth: { activeRole: RoleName.BOOKING_CONTACT } }
    )

    const statusFilter = screen.getByTestId('FilterByCourseStatus')
    await userEvent.click(statusFilter)

    await userEvent.click(
      within(statusFilter).getByText(
        t(`course-statuses.${Course_Status_Enum.Cancelled}`)
      )
    )

    expect(
      screen.getByTestId(`course-row-${courses[0].id}`)
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId(`course-row-${courses[0].id}`)).getByText(
        t(`course-statuses.${Course_Status_Enum.Cancelled}`)
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`course-row-${courses[1].id}`)
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId(`course-row-${courses[1].id}`)).getByText(
        t(`course-statuses.${Course_Status_Enum.Cancelled}`)
      )
    ).toBeInTheDocument()
  })

  it('display scheduled courses for booking contact and org key contact', async () => {
    const course = buildUserCourse({
      overrides: {
        schedule: [
          {
            id: 'id1',
            start: addHours(new Date(), 1),
            end: addHours(new Date(), 1),
          },
        ],
      },
    })

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]._or ?? [{}] : [{}]

        const scheduledCondition =
          orCondition[0]?.status?._nin?.includes(
            Course_Status_Enum.Cancelled
          ) &&
          orCondition[0]?.status?._nin?.includes(Course_Status_Enum.Declined) &&
          Boolean(orCondition[0]?.schedule?.end?._gt)

        const courses = scheduledCondition ? [course] : []

        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses,
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <ManageContactRoleCourses isBookingContact={true} />
      </Provider>,
      { auth: { activeRole: RoleName.BOOKING_CONTACT } }
    )

    const statusFilter = screen.getByTestId('FilterByCourseStatus')
    await userEvent.click(statusFilter)

    await userEvent.click(
      within(statusFilter).getByText(
        t(`course-statuses.${Course_Status_Enum.Scheduled}`)
      )
    )

    expect(screen.getByTestId(`course-row-${course.id}`)).toBeInTheDocument()

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        t(`course-statuses.${Course_Status_Enum.Scheduled}`)
      )
    ).toBeInTheDocument()
  })

  it('display awaiting grade courses for booking contact and org key contact', async () => {
    const course = buildUserCourse({
      overrides: {
        participants: [
          { healthSafetyConsent: true, grade: null, attended: true },
        ],
        schedule: [
          {
            id: 'id1',
            start: addHours(new Date(), -2),
            end: addHours(new Date(), -1),
          },
        ],
        status: Course_Status_Enum.GradeMissing,
      },
    })
    course.courseParticipants = [{ grade: null, healthSafetyConsent: true }]

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]?._or ?? [{}] : [{}]

        const awaitGradeCondition =
          orCondition[0]?.participants?.grade?._is_null === true &&
          Boolean(orCondition[0].schedule?.end?._lt)

        const courses = awaitGradeCondition ? [course] : []

        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses,
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <ManageContactRoleCourses />
      </Provider>,
      { auth: { activeRole: RoleName.BOOKING_CONTACT } }
    )

    const statusFilter = screen.getByTestId('FilterByCourseStatus')
    await userEvent.click(statusFilter)

    await userEvent.click(
      within(statusFilter).getByText(
        t(`course-statuses.${AttendeeOnlyCourseStatus.AwaitingGrade}`)
      )
    )

    expect(screen.getByTestId(`course-row-${course.id}`)).toBeInTheDocument()

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        t(`course-statuses.${AttendeeOnlyCourseStatus.AwaitingGrade}`)
      )
    ).toBeInTheDocument()
  })

  it('display completed status for evaluation missing course', () => {
    const courses = [
      buildUserCourse({
        overrides: { status: Course_Status_Enum.EvaluationMissing },
      }),
    ]

    const client = {
      executeQuery: () => {
        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: courses,
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <ManageContactRoleCourses />
      </Provider>,
      { auth: { activeRole: RoleName.BOOKING_CONTACT } }
    )

    expect(
      within(screen.getByTestId(`course-row-${courses[0].id}`)).getByText(
        t(`course-statuses.${Course_Status_Enum.Completed}`)
      )
    ).toBeInTheDocument()
  })
})
