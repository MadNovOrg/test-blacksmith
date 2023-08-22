import { setMedia } from 'mock-match-media'
import React from 'react'
import { getI18n } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Invite_Status_Enum,
  Course_Status_Enum,
  Order_By,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities } from '@test/mock-data-utils'

import {
  buildCourseTrainer,
  buildTrainerCourse,
  expectCourseTableTo,
} from './test-utils'
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

  it('redirects to the course builder if course is in draft', async () => {
    const TRAINER_PROFILE_ID = chance.guid()

    const trainerCourse = buildTrainerCourse({
      overrides: {
        trainers: [
          buildCourseTrainer({
            profile: { id: TRAINER_PROFILE_ID },
            status: Course_Invite_Status_Enum.Accepted,
          }),
        ],
        status: Course_Status_Enum.TrainerPending,
        isDraft: true,
        modulesAgg: {
          aggregate: {
            count: 5,
          },
        },
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: [trainerCourse],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="courses">
            <Route index element={<TrainerCourses />} />
            <Route path=":id/modules" element={<p>course builder</p>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          profile: { id: TRAINER_PROFILE_ID },
        },
      },
      { initialEntries: ['/courses'] }
    )

    await userEvent.click(
      within(screen.getByTestId(`course-row-${trainerCourse.id}`)).getByText(
        trainerCourse.name
      )
    )

    expect(screen.getByText(/course builder/i)).toBeInTheDocument()
  })

  it("redirects to the course builder if is not in draft but doesn't have any modules", async () => {
    const TRAINER_PROFILE_ID = chance.guid()

    const trainerCourse = buildTrainerCourse({
      overrides: {
        trainers: [
          buildCourseTrainer({
            profile: { id: TRAINER_PROFILE_ID },
            status: Course_Invite_Status_Enum.Accepted,
          }),
        ],
        status: Course_Status_Enum.TrainerPending,
        isDraft: false,
        modulesAgg: {
          aggregate: {
            count: 0,
          },
        },
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: [trainerCourse],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="courses">
            <Route index element={<TrainerCourses />} />
            <Route path=":id/modules" element={<p>course builder</p>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          profile: { id: TRAINER_PROFILE_ID },
        },
      },
      { initialEntries: ['/courses'] }
    )

    await userEvent.click(
      within(screen.getByTestId(`course-row-${trainerCourse.id}`)).getByText(
        trainerCourse.name
      )
    )

    expect(screen.getByText(/course builder/i)).toBeInTheDocument()
  })
})
