import { t } from 'i18next'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  JoinWaitlistMutation,
  JoinWaitlistMutationVariables,
  WaitlistCourseQuery,
  WaitlistCourseQueryVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseWaitlist } from './CourseWaitlist'

describe('page: Waitlist', () => {
  it('displays a skeleton while loading course details', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <MemoryRouter>
          <CourseWaitlist />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('course-info-skeleton')).toBeInTheDocument()
  })

  it("renders an alert if a course doesn't exist", () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: WaitlistCourseQuery }>({
          data: {
            courses: [],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <MemoryRouter>
          <CourseWaitlist />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"It seems like a course your trying to join the waitlist doesn't exist anymore."`
    )
  })

  it('displays course details', async () => {
    const course = buildCourse()
    const courseId = 10000

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: WaitlistCourseQueryVariables
      }) => {
        return fromValue<{ data: WaitlistCourseQuery }>({
          data: {
            courses: variables.id === courseId ? [course] : [],
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <MemoryRouter initialEntries={[`/waitlist?course_id=${courseId}`]}>
          <Routes>
            <Route path="/waitlist" element={<CourseWaitlist />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    const {
      schedule: [
        {
          start = '',
          venue: {
            name = '',
            addressLineOne = '',
            city = '',
            postCode = '',
          } = {},
        },
      ] = [],
    } = course
    const startEndTimes = `${t('dates.withTime', {
      date: start,
    })}`
    expect(screen.getAllByText(startEndTimes)).toHaveLength(2)
    expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.getByText(addressLineOne)).toBeInTheDocument()
    expect(screen.getByText(`${city}, ${postCode}`)).toBeInTheDocument()
  })

  it('adds a user to the waitlist', async () => {
    const courseId = 10000

    const client = {
      executeQuery: () =>
        fromValue<{ data: WaitlistCourseQuery }>({
          data: {
            courses: [buildCourse()],
          },
        }),
      executeMutation: ({
        variables,
      }: {
        variables: JoinWaitlistMutationVariables
      }) => {
        const submittedVariables = variables.input

        const success = submittedVariables.courseId === courseId

        return fromValue<{ data: JoinWaitlistMutation }>({
          data: {
            waitlist: {
              affected_rows: success ? 1 : 0,
            },
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <MemoryRouter initialEntries={[`/waitlist?course_id=${courseId}`]}>
          <Routes>
            <Route path="/waitlist" element={<CourseWaitlist />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.type(screen.getByLabelText(/first name/i), 'John')
    userEvent.type(screen.getByLabelText(/last name/i), 'Doe')
    userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
    userEvent.type(screen.getByLabelText(/phone/i), '11111')
    userEvent.type(screen.getByLabelText(/organisation name/i), 'Org')

    userEvent.click(screen.getByText(/join waiting list/i))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"You’ve been added to the course waitlist."`
      )
    })
  })
})
