import { setMedia } from 'mock-match-media'
import React from 'react'
import { getI18n } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Order_By,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities } from '@test/mock-data-utils'

import { buildTrainerCourse, expectCourseTableTo } from './test-utils'
import { TrainerCourses } from './TrainerCourses'

const { t } = getI18n()
const blendedLearningLabel = t('common.blended-learning')

describe('trainers-pages/MyCourses', () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

  it('renders loading', async () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders no results', async () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: [],
            course_aggregate: {
              aggregate: {
                count: 0,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    const tbl = screen.getByTestId('courses-table')

    expect(within(tbl).getByTestId('TableNoRows')).toBeInTheDocument()
    expect(
      within(tbl).queryByTestId('fetching-courses')
    ).not.toBeInTheDocument()
    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(0)
  })

  it('renders courses', async () => {
    const courses = buildEntities(3, buildTrainerCourse)

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
      </Provider>
    )

    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: courses,
    })

    expect(
      within(table).queryByTestId('fetching-courses')
    ).not.toBeInTheDocument()
    expect(within(table).queryByTestId('TableNoRows')).not.toBeInTheDocument()
  })

  it('shows course title and code', async () => {
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
      </Provider>
    )

    const table = screen.getByTestId('courses-table')

    const courseTitle = within(table).getByTestId('course-title')
    expect(courseTitle).toBeInTheDocument()
    expect(courseTitle).toHaveTextContent(`${courses[0].name}`)
    const courseCode = within(table).getByTestId('course-code')
    expect(courseCode).toBeInTheDocument()
    expect(courseCode).toHaveTextContent('OP-L1-10000')
  })

  it('shows the blended learning label', async () => {
    const courseWithBlendedLearning = buildTrainerCourse({
      overrides: { go1Integration: true },
    })
    const courseWithoutBlendedLearning = buildTrainerCourse()
    const courses = [courseWithBlendedLearning, courseWithoutBlendedLearning]

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
      </Provider>
    )

    const table = screen.getByTestId('courses-table')
    const blendedLearning = within(table).getByText(blendedLearningLabel)
    expect(blendedLearning).toBeInTheDocument()
  })

  it('sorts courses by name', async () => {
    const courses = buildEntities(2, buildTrainerCourse)
    const reversedCourses = courses.slice().reverse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const orderBy = Array.isArray(variables.orderBy)
          ? variables.orderBy[0]
          : variables.orderBy ?? {}

        return fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: orderBy.name === Order_By.Asc ? courses : reversedCourses,
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
        <TrainerCourses />
      </Provider>
    )

    const table = screen.getByTestId('courses-table')

    await userEvent.click(within(table).getByText('Name'))

    await waitFor(() => {
      expect(screen.getByTestId(`course-row-${courses[0].id}`)).toHaveAttribute(
        'data-index',
        '0'
      )
    })
  })

  it('paginates courses', async () => {
    const firstBatch = buildEntities(12, buildTrainerCourse)
    const secondBatch = buildEntities(12, buildTrainerCourse)

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const offset = variables.offset
        const limit = variables.limit

        return fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: offset === 0 && limit === 12 ? firstBatch : secondBatch,
            course_aggregate: {
              aggregate: {
                count: firstBatch.length + secondBatch.length,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    const coursesPagination = screen.getByTestId('courses-pagination')

    expect(
      within(coursesPagination).getByLabelText('Go to previous page')
    ).toBeDisabled()

    expect(
      screen.getByTestId(`course-row-${firstBatch[firstBatch.length - 1].id}`)
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId(`course-row-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    await userEvent.click(
      within(coursesPagination).getByLabelText('Go to next page')
    )

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `course-row-${secondBatch[firstBatch.length - 1].id}`
        )
      ).toBeInTheDocument()
      expect(
        screen.queryByTestId(`course-row-${firstBatch[0].id}`)
      ).not.toBeInTheDocument()
    })
  })
})
