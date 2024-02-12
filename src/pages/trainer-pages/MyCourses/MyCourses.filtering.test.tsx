/**
 * TODO Fix this eslint ignore
 * @author Alexei.Gaidulean <Alexei.Gaidulean@teamteach.co.uk>
 */
/* eslint-disable vitest/expect-expect */
import { addHours } from 'date-fns/esm'
import { setMedia } from 'mock-match-media'
import React from 'react'
import { getI18n } from 'react-i18next'
import { Client, Provider } from 'urql'
import { beforeAll, describe } from 'vitest'
import { fromValue } from 'wonka'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Type_Enum,
  Order_By,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import {
  AdminOnlyCourseStatus,
  AttendeeOnlyCourseStatus,
  RoleName,
} from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities } from '@test/mock-data-utils'

import {
  buildTrainerCourse,
  buildTrainerCourseWithDates,
  expectCourseTableTo,
  TrainerCourseQueryFragment,
} from './test-utils'
import { TrainerCourses } from './TrainerCourses'

const { t } = getI18n()
const blendedLearningLabel = t('common.blended-learning')

describe('trainers-pages/MyCourses', () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

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
        const conditions = variables.where?._or ?? []
        const courses =
          conditions[0]?.searchFields?._ilike === `%${keyword}%`
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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('FilterSearch-Input')).toBeVisible()
    })

    const search = screen.getByTestId('FilterSearch-Input')
    await userEvent.type(search, keyword)

    await waitFor(() => {
      expect(screen.getByTestId('courses-table')).toBeVisible()
    })

    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: [filteredCourse],
      exclude: [course],
      timeout: 4000,
    })
  })

  describe('Start and end dates filter', () => {
    let course_from_15_01_23_to_27_11_23: TrainerCourseQueryFragment
    let course_from_13_03_23_to_25_07_23: TrainerCourseQueryFragment
    let course_from_22_03_23_to_20_12_23: TrainerCourseQueryFragment
    let allCourses: TrainerCourseQueryFragment[]
    beforeAll(() => {
      // 15/01/2023 - 27/11/2023
      course_from_15_01_23_to_27_11_23 = buildTrainerCourseWithDates(
        new Date(2023, 0, 15),
        new Date(2023, 10, 27)
      )
      // 13/03/2023 - 25/07/2023
      course_from_13_03_23_to_25_07_23 = buildTrainerCourseWithDates(
        new Date(2023, 2, 13),
        new Date(2023, 6, 25)
      )
      // 22/03/2023 - 20/12/2023
      course_from_22_03_23_to_20_12_23 = buildTrainerCourseWithDates(
        new Date(2023, 2, 22),
        new Date(2023, 11, 20)
      )

      allCourses = [
        course_from_15_01_23_to_27_11_23,
        course_from_13_03_23_to_25_07_23,
        course_from_22_03_23_to_20_12_23,
      ]
    })

    it('shows all courses with start date equal or greater than filter from date', async () => {
      const client = {
        executeQuery: ({
          variables,
        }: {
          variables: TrainerCoursesQueryVariables
        }) => {
          const conditions =
            variables.where?.schedule?._and?.filter(obj =>
              Object.keys(obj).includes('start')
            ).length === 1 ?? false

          const courses = conditions
            ? [
                course_from_13_03_23_to_25_07_23,
                course_from_22_03_23_to_20_12_23,
              ]
            : allCourses

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

      render(
        <Provider value={client as unknown as Client}>
          <TrainerCourses />
        </Provider>
      )

      const table = screen.getByTestId('courses-table')
      await expectCourseTableTo({
        table,
        include: [
          course_from_15_01_23_to_27_11_23,
          course_from_13_03_23_to_25_07_23,
          course_from_22_03_23_to_20_12_23,
        ],
      })

      const from = within(screen.getByTestId('date-range')).getByLabelText(
        'From'
      )

      from.focus()
      await userEvent.paste('13/03/2023') // second course's start date

      await expectCourseTableTo({
        table,
        include: [
          course_from_13_03_23_to_25_07_23,
          course_from_22_03_23_to_20_12_23,
        ],
        exclude: [course_from_15_01_23_to_27_11_23],
      })
    })

    it('shows all courses with end date equal or lesser than filter from date', async () => {
      const client = {
        executeQuery: ({
          variables,
        }: {
          variables: TrainerCoursesQueryVariables
        }) => {
          const conditions =
            variables.where?.schedule?._and?.filter(obj =>
              Object.keys(obj).includes('end')
            ).length === 1 ?? false

          const courses = conditions
            ? [
                course_from_15_01_23_to_27_11_23,
                course_from_13_03_23_to_25_07_23,
              ]
            : allCourses

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

      render(
        <Provider value={client as unknown as Client}>
          <TrainerCourses />
        </Provider>
      )

      const table = screen.getByTestId('courses-table')
      await expectCourseTableTo({
        table,
        include: [
          course_from_15_01_23_to_27_11_23,
          course_from_13_03_23_to_25_07_23,
          course_from_22_03_23_to_20_12_23,
        ],
      })

      const to = within(screen.getByTestId('date-range')).getByLabelText('To')
      to.focus()
      await userEvent.paste('25/07/2023') // second course's end date

      await expectCourseTableTo({
        table,
        include: [
          course_from_15_01_23_to_27_11_23,
          course_from_13_03_23_to_25_07_23,
        ],
        exclude: [course_from_22_03_23_to_20_12_23],
      })
    })

    it('shows all courses falling between from and end dates', async () => {
      const client = {
        executeQuery: ({
          variables,
        }: {
          variables: TrainerCoursesQueryVariables
        }) => {
          const conditions =
            variables.where?.schedule?._and?.filter(obj => {
              const keys = Object.keys(obj)
              return keys.includes('start') || keys.includes('end')
            }).length === 2 ?? false
          const courses = conditions
            ? [course_from_13_03_23_to_25_07_23]
            : allCourses

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

      render(
        <Provider value={client as unknown as Client}>
          <TrainerCourses />
        </Provider>
      )

      const table = screen.getByTestId('courses-table')
      await expectCourseTableTo({
        table,
        include: [
          course_from_15_01_23_to_27_11_23,
          course_from_13_03_23_to_25_07_23,
          course_from_22_03_23_to_20_12_23,
        ],
      })

      const from = within(screen.getByTestId('date-range')).getByLabelText(
        'From'
      )
      from.focus()
      await userEvent.paste('13/03/2023') // second course's start date

      const to = within(screen.getByTestId('date-range')).getByLabelText('To')
      to.focus()
      await userEvent.paste('25/07/2023') // second course's end date

      await expectCourseTableTo({
        table,
        include: [course_from_13_03_23_to_25_07_23],
        exclude: [
          course_from_15_01_23_to_27_11_23,
          course_from_22_03_23_to_20_12_23,
        ],
      })
    })
  })

  it('filters by blended learning', async () => {
    const courseWithBlendedLearning = buildTrainerCourse({
      overrides: { go1Integration: true },
    })
    const courseWithoutBlendedLearning = buildTrainerCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const conditions = variables.where?.go1Integration?._eq ?? false
        const courses = conditions
          ? [courseWithBlendedLearning]
          : [courseWithBlendedLearning, courseWithoutBlendedLearning]

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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: [courseWithBlendedLearning, courseWithoutBlendedLearning],
    })

    const blendedLearningFilter = screen.getByLabelText(blendedLearningLabel)
    await userEvent.click(blendedLearningFilter)

    await expectCourseTableTo({
      table,
      include: [courseWithBlendedLearning],
      exclude: [courseWithoutBlendedLearning],
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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    await userEvent.click(
      within(screen.getByTestId('FilterByCourseLevel')).getByText('Level One')
    )
    await userEvent.click(
      within(screen.getByTestId('FilterByCourseLevel')).getByText('Level Two')
    )

    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: [filteredCourse],
      exclude: [course],
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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    await userEvent.click(
      within(screen.getByTestId('FilterByCourseType')).getByText('Open')
    )
    await userEvent.click(
      within(screen.getByTestId('FilterByCourseType')).getByText('Closed')
    )

    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: [filteredCourse],
      exclude: [course],
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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    await userEvent.click(
      within(screen.getByTestId('FilterByCourseStatus')).getByText('Scheduled')
    )
    await userEvent.click(
      within(screen.getByTestId('FilterByCourseStatus')).getByText('Completed')
    )

    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: [filteredCourse],
      exclude: [course],
    })
  })

  it('filters by delivery type', async () => {
    const course = buildTrainerCourse()
    const filteredCourse = buildTrainerCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const courses = variables.where?.deliveryType?._in?.includes(
          Course_Delivery_Type_Enum.Virtual
        )
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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    await userEvent.click(
      within(screen.getByTestId('FilterByCourseDeliveryType')).getByText(
        'Virtual'
      )
    )
    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: [filteredCourse],
      exclude: [course],
    })
  })

  it('filters by cancellation requested status', async () => {
    const course = buildTrainerCourse()
    const filteredCourse = buildTrainerCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const courses =
          variables.where?.cancellationRequest?.id &&
          variables.where?.cancellationRequest?.id._is_null === false
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

    await userEvent.click(
      within(screen.getByTestId('FilterByCourseStatus')).getByText(
        'Cancellation requested'
      )
    )

    const table = screen.getByTestId('courses-table')
    await expectCourseTableTo({
      table,
      include: [filteredCourse],
      exclude: [course],
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

  it.each([
    AdminOnlyCourseStatus.CancellationRequested,
    AttendeeOnlyCourseStatus.AwaitingGrade,
    Course_Status_Enum.Cancelled,
    Course_Status_Enum.Completed,
    Course_Status_Enum.Scheduled,
  ])('display status filter %s for org admin', async status => {
    render(<TrainerCourses />, {
      auth: {
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      },
    })

    const statusFilter = screen.getByTestId('FilterByCourseStatus')
    await userEvent.click(statusFilter)

    expect(
      within(statusFilter).getByText(t(`course-statuses.${status}`))
    ).toBeInTheDocument()
  })

  it('display cancel requested courses for org admin', async () => {
    const course = buildTrainerCourse()
    course.cancellationRequest = { id: 'id' }

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]?._or ?? [{}] : [{}]

        const cancelRequestCondition =
          orCondition[0]?.cancellationRequest?.id?._is_null === false

        const courses = cancelRequestCondition ? [course] : []

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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>,
      { auth: { activeRole: RoleName.USER, isOrgAdmin: true } }
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

  it('display cancelled courses for org admin', async () => {
    const courses = [
      buildTrainerCourse({
        overrides: { status: Course_Status_Enum.Cancelled },
      }),
      buildTrainerCourse({
        overrides: { status: Course_Status_Enum.Declined },
      }),
    ]

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]?._or ?? [{}] : [{}]

        const cancelledCondition =
          orCondition[0]?.status?._in?.includes(Course_Status_Enum.Cancelled) &&
          orCondition[0]?.status?._in?.includes(Course_Status_Enum.Declined)

        return fromValue<{ data: TrainerCoursesQuery }>({
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
        <TrainerCourses />
      </Provider>,
      { auth: { activeRole: RoleName.USER, isOrgAdmin: true } }
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

  it('display scheduled status for course in progress and in future and NOT cancelled for org admin', async () => {
    const courses = [
      buildTrainerCourse({
        overrides: {
          schedule: [
            {
              id: 'id1',
              start: addHours(new Date(), 1),
              end: addHours(new Date(), 1),
            },
          ],
        },
      }),
      buildTrainerCourse({
        overrides: {
          schedule: [
            {
              id: 'id2',
              start: addHours(new Date(), -1),
              end: addHours(new Date(), 1),
            },
          ],
        },
      }),
    ]

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TrainerCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]?._or ?? [{}] : [{}]

        const scheduledCondition =
          orCondition[0]?.status?._nin?.includes(
            Course_Status_Enum.Cancelled
          ) &&
          orCondition[0]?.status?._nin?.includes(Course_Status_Enum.Declined) &&
          Boolean(orCondition[0]?.schedule?.end?._gt)

        return fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: scheduledCondition ? courses : [],
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
      </Provider>,
      { auth: { activeRole: RoleName.USER, isOrgAdmin: true } }
    )

    const statusFilter = screen.getByTestId('FilterByCourseStatus')
    await userEvent.click(statusFilter)

    await userEvent.click(
      within(statusFilter).getByText(
        t(`course-statuses.${Course_Status_Enum.Scheduled}`)
      )
    )

    expect(
      within(screen.getByTestId(`course-row-${courses[0].id}`)).getByText(
        t(`course-statuses.${Course_Status_Enum.Scheduled}`)
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId(`course-row-${courses[1].id}`)).getByText(
        t(`course-statuses.${Course_Status_Enum.Scheduled}`)
      )
    ).toBeInTheDocument()
  })

  it('display awaiting grade courses for org amdin', async () => {
    const course = buildTrainerCourse({
      overrides: {
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
        variables: TrainerCoursesQueryVariables
      }) => {
        const mainCondition = variables.where?._and
        const orCondition = mainCondition ? mainCondition[1]?._or ?? [{}] : [{}]
        const gradesCondition = orCondition[0]
          ? orCondition[0]?._or ?? [{}, {}]
          : [{}, {}]

        const awaitGradeCondition =
          Boolean(orCondition[0].schedule?.end?._lt) &&
          gradesCondition[0].participants?.grade?._is_null === true

        const courses = awaitGradeCondition ? [course] : []

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

    render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>,
      { auth: { activeRole: RoleName.USER, isOrgAdmin: true } }
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
})
