import { setMedia } from 'mock-match-media'
import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { TrainerCoursesQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { render, screen, within } from '@test/index'
import { buildEntities } from '@test/mock-data-utils'

import { buildTrainerCourse } from './test-utils'
import { TrainerCourses } from './TrainerCourses'

describe('trainers-pages/MyCourses', () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

  it('shows course waitlist count if user is TT admin', async () => {
    const courses = buildEntities(1, buildTrainerCourse)

    const client = {
      executeQuery: () =>
        fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses,
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    const table = screen.getByTestId('courses-table')

    const participantsCell = within(table).getByTestId('participants-cell')
    expect(participantsCell).toBeInTheDocument()
    expect(participantsCell).toHaveTextContent(/^12\+2\/12$/)
  })

  it('shows course waitlist count if user is TT ops', async () => {
    const courses = buildEntities(1, buildTrainerCourse)

    const client = {
      executeQuery: () =>
        fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses,
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    const table = screen.getByTestId('courses-table')

    const participantsCell = within(table).getByTestId('participants-cell')
    expect(participantsCell).toBeInTheDocument()
    expect(participantsCell).toHaveTextContent(/^12\+2\/12$/)
  })

  it('does not show course waitlist count if user is trainer', async () => {
    const courses = buildEntities(1, buildTrainerCourse)

    const client = {
      executeQuery: () =>
        fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses,
            course_aggregate: {
              aggregate: {
                count: courses.length,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      }
    )

    const table = screen.getByTestId('courses-table')

    const participantsCell = within(table).getByTestId('participants-cell')
    expect(participantsCell).toBeInTheDocument()
    expect(participantsCell).toHaveTextContent(/^12\/12$/)
  })
})
