import { addHours } from 'date-fns/esm'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { Grade_Enum, UserCoursesQuery } from '@app/generated/graphql'

import { render, screen, within } from '@test/index'

import { MyCourses } from './MyCourses'
import { buildUserCourse } from './test-utils'

describe('user-pages/MyCourses - displaying statuses', () => {
  it("displays correct status for a course that doesn't have health consent", () => {
    const course = buildUserCourse()

    course.participants = [
      { ...course.participants[0], healthSafetyConsent: false },
    ]

    const client = {
      executeQuery: () => {
        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: [course],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/']}>
          <MyCourses />
        </MemoryRouter>
      </Provider>
    )

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        'Info required'
      )
    ).toBeInTheDocument()
  })

  it("displays correct status for a course that doesn't have evaluation submitted", () => {
    const course = buildUserCourse()

    course.participants = [
      { ...course.participants[0], healthSafetyConsent: true },
    ]

    course.evaluation_answers_aggregate = {
      aggregate: {
        count: 0,
      },
    }

    course.schedule = [
      {
        ...course.schedule[0],
        start: addHours(new Date(), -3),
        end: addHours(new Date(), -2),
      },
    ]

    const client = {
      executeQuery: () => {
        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: [course],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/']}>
          <MyCourses />
        </MemoryRouter>
      </Provider>
    )

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        'Missing evaluation'
      )
    ).toBeInTheDocument()
  })

  it('display correct status for unattended course', async () => {
    const course = buildUserCourse()

    course.participants = [
      {
        ...course.participants[0],
        healthSafetyConsent: false,
        attended: false,
      },
    ]

    course.schedule = [
      {
        ...course.schedule[0],
        start: addHours(new Date(), -3),
        end: addHours(new Date(), -2),
      },
    ]

    const client = {
      executeQuery: () => {
        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: [course],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/']}>
          <MyCourses />
        </MemoryRouter>
      </Provider>
    )

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        'Unattended'
      )
    ).toBeInTheDocument()
  })

  it('displays correct status for not graded course', () => {
    const course = buildUserCourse()

    course.participants = [
      {
        ...course.participants[0],
        healthSafetyConsent: true,
        attended: true,
        grade: null,
      },
    ]

    course.schedule = [
      {
        ...course.schedule[0],
        start: addHours(new Date(), -3),
        end: addHours(new Date(), -2),
      },
    ]

    const client = {
      executeQuery: () => {
        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: [course],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/']}>
          <MyCourses />
        </MemoryRouter>
      </Provider>
    )

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        'Missing grade'
      )
    ).toBeInTheDocument()
  })

  it('displays correct status for scheduled course', () => {
    const course = buildUserCourse()

    course.participants = [
      {
        ...course.participants[0],
        healthSafetyConsent: true,
        attended: null,
        grade: null,
      },
    ]

    course.schedule = [
      {
        ...course.schedule[0],
        start: addHours(new Date(), 3),
        end: addHours(new Date(), 5),
      },
    ]

    const client = {
      executeQuery: () => {
        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: [course],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/']}>
          <MyCourses />
        </MemoryRouter>
      </Provider>
    )

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        'Scheduled'
      )
    ).toBeInTheDocument()
  })

  it('displays correct status for completed course', () => {
    const course = buildUserCourse()

    course.participants = [
      {
        ...course.participants[0],
        healthSafetyConsent: true,
        attended: true,
        grade: Grade_Enum.Pass,
      },
    ]

    course.evaluation_answers_aggregate = {
      aggregate: {
        count: 5,
      },
    }

    course.schedule = [
      {
        ...course.schedule[0],
        start: addHours(new Date(), -3),
        end: addHours(new Date(), -1),
      },
    ]

    const client = {
      executeQuery: () => {
        return fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: [course],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/']}>
          <MyCourses />
        </MemoryRouter>
      </Provider>
    )

    expect(
      within(screen.getByTestId(`course-row-${course.id}`)).getByText(
        'Completed'
      )
    ).toBeInTheDocument()
  })
})
