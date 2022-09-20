import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { DeepPartial } from 'ts-essentials'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  Order_By,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { render, screen, within, chance, userEvent, waitFor } from '@test/index'
import { buildEntities } from '@test/mock-data-utils'
import { Providers } from '@test/providers'

import { MyCourses } from './MyCourses'
import { buildTrainerCourse } from './test-utils'

const _render = (
  ui: React.ReactElement,
  providers: DeepPartial<Providers> = {}
) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>, providers)
}

describe('trainers-pages/MyCourses', () => {
  it('renders loading', async () => {
    const client = {
      executeQuery: () => never,
    }

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    const tbl = screen.getByTestId('courses-table')

    expect(within(tbl).getByTestId('fetching-courses')).toBeInTheDocument()
    expect(within(tbl).queryByTestId('TableNoRows')).not.toBeInTheDocument()
    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(0)
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    const tbl = screen.getByTestId('courses-table')

    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(courses.length)
    expect(
      within(tbl).queryByTestId('fetching-courses')
    ).not.toBeInTheDocument()
    expect(within(tbl).queryByTestId('TableNoRows')).not.toBeInTheDocument()
  })

  it('filters by search', async () => {
    const keyword = chance.word()

    const course = buildTrainerCourse()
    const filteredCourse = buildTrainerCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const courses =
          variables.where?.name?._ilike === `%${keyword}%`
            ? [filteredCourse]
            : [course]

        return fromValue<{ data: TrainerCoursesQuery }>({
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    const search = screen.getByTestId('FilterSearch-Input')
    userEvent.type(search, keyword)

    await waitFor(() => {
      expect(
        screen.getByTestId(`course-row-${filteredCourse.id}`)
      ).toBeInTheDocument()
      expect(
        screen.queryByTestId(`course-row-${course.id}`)
      ).not.toBeInTheDocument()
    })
  })

  it('filters by level', async () => {
    const course = buildTrainerCourse()
    const filteredCourse = buildTrainerCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const courses =
          variables.where?.level?._in?.includes(Course_Level_Enum.Level_1) &&
          variables.where.level._in.includes(Course_Level_Enum.Level_2)
            ? [filteredCourse]
            : [course]

        return fromValue<{ data: TrainerCoursesQuery }>({
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseLevel')).getByText('Level One')
    )
    userEvent.click(
      within(screen.getByTestId('FilterCourseLevel')).getByText('Level Two')
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId(`course-row-${course.id}`)
      ).not.toBeInTheDocument()

      expect(
        screen.getByTestId(`course-row-${filteredCourse.id}`)
      ).toBeInTheDocument()
    })
  })

  it('filters by type', async () => {
    const course = buildTrainerCourse()
    const filteredCourse = buildTrainerCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const courses =
          variables.where?.type?._in?.includes(Course_Type_Enum.Open) &&
          variables.where.type._in.includes(Course_Type_Enum.Closed)
            ? [filteredCourse]
            : [course]

        return fromValue<{ data: TrainerCoursesQuery }>({
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseType')).getByText('Open')
    )
    userEvent.click(
      within(screen.getByTestId('FilterCourseType')).getByText('Closed')
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId(`course-row-${course.id}`)
      ).not.toBeInTheDocument()

      expect(
        screen.getByTestId(`course-row-${filteredCourse.id}`)
      ).toBeInTheDocument()
    })
  })

  it('filters by status', async () => {
    const course = buildTrainerCourse()
    const filteredCourse = buildTrainerCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const courses =
          variables.where?.status?._in?.includes(
            Course_Status_Enum.Scheduled
          ) && variables.where.status._in.includes(Course_Status_Enum.Completed)
            ? [filteredCourse]
            : [course]

        return fromValue<{ data: TrainerCoursesQuery }>({
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText('Scheduled')
    )
    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText('Completed')
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId(`course-row-${course.id}`)
      ).not.toBeInTheDocument()

      expect(
        screen.getByTestId(`course-row-${filteredCourse.id}`)
      ).toBeInTheDocument()
    })
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    userEvent.click(screen.getByText('Name'))

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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>
    )

    expect(
      screen.getByTestId(`course-row-${firstBatch[firstBatch.length - 1].id}`)
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId(`course-row-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Go to next page'))

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `course-row-${secondBatch[firstBatch.length - 1].id}`
        )
      ).toBeInTheDocument()
      expect(
        screen.queryByTestId(`course-row-${firstBatch[0].id}`)
      ).not.toBeInTheDocument()

      expect(screen.getByLabelText('Go to next page')).toBeDisabled()
      expect(screen.getByLabelText('Go to previous page')).toBeEnabled()
    })
  })

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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    const participantsCell = screen.getByTestId('participants-cell')
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    const participantsCell = screen.getByTestId('participants-cell')
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

    _render(
      <Provider value={client as unknown as Client}>
        <MyCourses />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      }
    )

    const participantsCell = screen.getByTestId('participants-cell')
    expect(participantsCell).toBeInTheDocument()
    expect(participantsCell).toHaveTextContent(/^12\/12$/)
  })
})
