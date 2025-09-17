import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Type_Enum,
  Order_By,
  UserCoursesQuery,
  UserCoursesQueryVariables,
} from '@app/generated/graphql'

import { _render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities } from '@test/mock-data-utils'

import { buildUserCourse } from '../../utils/test-utils'

import { AttendeeCourses } from './AttendeeCourses'

describe('user-pages/MyCourses', () => {
  it('renders loading while fetching for courses', () => {
    const fetchingClient = {
      executeQuery: () => never,
    }

    _render(
      <Provider value={fetchingClient as unknown as Client}>
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )

    expect(screen.getByTestId('fetching-courses')).toBeInTheDocument()
  })

  it('displays a message when there are no courses', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: UserCoursesQuery }>({
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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )

    expect(screen.queryByTestId('fetching-courses')).not.toBeInTheDocument()
    expect(screen.getByText('No courses at this time')).toBeInTheDocument()
  })

  it('displays a message when there are no filtered courses', async () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: UserCoursesQuery }>({
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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )

    await userEvent.type(screen.getByPlaceholderText('Search'), 'search')

    expect(screen.queryByTestId('fetching-courses')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('No matching courses found')).toBeInTheDocument()
    })
  })

  it('renders courses', () => {
    const course = buildUserCourse({
      overrides: {
        type: Course_Type_Enum.Open,
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: UserCoursesQuery }>({
          data: {
            courses: [course],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        }),
    }

    _render(
      <Provider value={client as unknown as Client}>
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )

    userEvent.type(screen.getByPlaceholderText('Search'), 'search')

    expect(screen.queryByTestId('fetching-courses')).not.toBeInTheDocument()

    const courseRowElem = screen.getByTestId(`course-row-${course.id}`)

    expect(within(courseRowElem).getByText(course.name)).toBeInTheDocument()
    expect(
      within(courseRowElem).getByText(course.schedule[0].venue?.name ?? ''),
    ).toBeInTheDocument()
  })

  it('sorts courses by name', async () => {
    const courses = [buildUserCourse(), buildUserCourse()]
    const reversedCourses = courses.slice().reverse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const orderBy = Array.isArray(variables.orderBy)
          ? variables.orderBy[0]
          : variables.orderBy ?? {}

        return fromValue<{ data: UserCoursesQuery }>({
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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )

    userEvent.click(screen.getByText('Name'))

    await waitFor(() => {
      expect(screen.getByTestId(`course-row-${courses[0].id}`)).toHaveAttribute(
        'data-index',
        '0',
      )
    })
  })

  it('paginates courses', async () => {
    const firstBatch = buildEntities(12, buildUserCourse)
    const secondBatch = buildEntities(12, buildUserCourse)

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const offset = variables.offset
        const limit = variables.limit

        return fromValue<{ data: UserCoursesQuery }>({
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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] },
    )

    expect(
      screen.getByTestId(`course-row-${firstBatch[firstBatch.length - 1].id}`),
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId(`course-row-${secondBatch[0].id}`),
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByLabelText('Go to next page'))

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `course-row-${secondBatch[firstBatch.length - 1].id}`,
        ),
      ).toBeInTheDocument()
      expect(
        screen.queryByTestId(`course-row-${firstBatch[0].id}`),
      ).not.toBeInTheDocument()

      expect(screen.getByLabelText('Go to next page')).toBeDisabled()
      expect(screen.getByLabelText('Go to previous page')).toBeEnabled()
    })
  })
})
