import { setMedia } from 'mock-match-media'
import React from 'react'
import { getI18n } from 'react-i18next'
import { DeepPartial } from 'ts-essentials'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  Order_By,
  TrainerCourseFragment,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities } from '@test/mock-data-utils'
import { Providers } from '@test/providers'

import { buildTrainerCourse } from './test-utils'
import { TrainerCourses } from './TrainerCourses'

const { t } = getI18n()
const blendedLearningLabel = t('common.blended-learning')

const _render = (
  ui: React.ReactElement,
  providers: DeepPartial<Providers> = {}
) => {
  return render(<>{ui}</>, providers)
}

describe('trainers-pages/MyCourses', () => {
  it('renders loading', async () => {
    const client = {
      executeQuery: () => never,
    }

    _render(
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

    _render(
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

    _render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    const tbl = screen.getByTestId('courses-table')

    expect(tbl.querySelectorAll('.MyCoursesRow')).toHaveLength(courses.length)
    expect(
      within(tbl).queryByTestId('fetching-courses')
    ).not.toBeInTheDocument()
    expect(within(tbl).queryByTestId('TableNoRows')).not.toBeInTheDocument()
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

    _render(
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

    _render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    const table = screen.getByTestId('courses-table')
    const blendedLearning = within(table).getByText(blendedLearningLabel)
    expect(blendedLearning).toBeInTheDocument()
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
        const conditions = variables.where?._or ?? []
        const courses =
          conditions[0]?.name?._ilike === `%${keyword}%`
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
        <TrainerCourses />
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

  describe('Start and end dates filter', () => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

    const buildTrainerCourseWithDates = (
      start: Date,
      end: Date
    ): TrainerCourseFragment =>
      buildTrainerCourse({
        overrides: {
          dates: {
            aggregate: {
              start: {
                date: start.toISOString(),
              },
              end: {
                date: end.toISOString(),
              },
            },
          },
        },
      })

    let course_from_15_01_23_to_27_11_23: TrainerCourseFragment
    let course_from_13_03_23_to_25_07_23: TrainerCourseFragment
    let course_from_22_03_23_to_20_12_23: TrainerCourseFragment
    let allCourses: TrainerCourseFragment[]
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

      _render(
        <Provider value={client as unknown as Client}>
          <TrainerCourses />
        </Provider>
      )

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `course-row-${course_from_15_01_23_to_27_11_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_13_03_23_to_25_07_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_22_03_23_to_20_12_23.id}`
          )
        ).toBeInTheDocument()
      })

      const from = screen.getByLabelText('From')
      userEvent.paste(from, '13/03/2023') // second course's start date

      await waitFor(() => {
        expect(
          screen.queryByTestId(
            `course-row-${course_from_15_01_23_to_27_11_23.id}`
          )
        ).not.toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_13_03_23_to_25_07_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_22_03_23_to_20_12_23.id}`
          )
        ).toBeInTheDocument()
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

      _render(
        <Provider value={client as unknown as Client}>
          <TrainerCourses />
        </Provider>
      )

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `course-row-${course_from_15_01_23_to_27_11_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_13_03_23_to_25_07_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_22_03_23_to_20_12_23.id}`
          )
        ).toBeInTheDocument()
      })

      const to = screen.getByLabelText('To')
      userEvent.paste(to, '25/07/2023') // second course's end date

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `course-row-${course_from_15_01_23_to_27_11_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_13_03_23_to_25_07_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.queryByTestId(
            `course-row-${course_from_22_03_23_to_20_12_23.id}`
          )
        ).not.toBeInTheDocument()
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

      _render(
        <Provider value={client as unknown as Client}>
          <TrainerCourses />
        </Provider>
      )

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `course-row-${course_from_15_01_23_to_27_11_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_13_03_23_to_25_07_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_22_03_23_to_20_12_23.id}`
          )
        ).toBeInTheDocument()
      })

      const from = screen.getByLabelText('From')
      userEvent.paste(from, '13/03/2023') // second course's start date

      const to = screen.getByLabelText('To')
      userEvent.paste(to, '25/07/2023') // second course's end date

      await waitFor(() => {
        expect(
          screen.queryByTestId(
            `course-row-${course_from_15_01_23_to_27_11_23.id}`
          )
        ).not.toBeInTheDocument()
        expect(
          screen.getByTestId(
            `course-row-${course_from_13_03_23_to_25_07_23.id}`
          )
        ).toBeInTheDocument()
        expect(
          screen.queryByTestId(
            `course-row-${course_from_22_03_23_to_20_12_23.id}`
          )
        ).not.toBeInTheDocument()
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

    _render(
      <Provider value={client as unknown as Client}>
        <TrainerCourses />
      </Provider>
    )

    await waitFor(() => {
      expect(
        screen.getByTestId(`course-row-${courseWithBlendedLearning.id}`)
      ).toBeInTheDocument()
      expect(
        screen.queryByTestId(`course-row-${courseWithoutBlendedLearning.id}`)
      ).toBeInTheDocument()
    })

    const blendedLearningFilter = screen.getByLabelText(blendedLearningLabel)
    userEvent.click(blendedLearningFilter)

    await waitFor(() => {
      expect(
        screen.getByTestId(`course-row-${courseWithBlendedLearning.id}`)
      ).toBeInTheDocument()
      expect(
        screen.queryByTestId(`course-row-${courseWithoutBlendedLearning.id}`)
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
        <TrainerCourses />
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
        <TrainerCourses />
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
        <TrainerCourses />
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
        <TrainerCourses />
      </Provider>
    )

    const table = screen.getByTestId('courses-table')

    userEvent.click(within(table).getByText('Name'))

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

    userEvent.click(within(coursesPagination).getByLabelText('Go to next page'))

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

    _render(
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

    _render(
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

    _render(
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

  it("doesn't display actionable courses table if there are no courses", async () => {
    const client = {
      executeQuery: () => {
        return fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: [],
            course_aggregate: {
              aggregate: {
                count: 0,
              },
            },
          },
        })
      },
    } as unknown as Client

    _render(
      <Provider value={client}>
        <TrainerCourses />
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    expect(
      screen.queryByTestId('actionable-courses-table')
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('courses-table')).toBeInTheDocument()
    expect(screen.queryByText(/all courses/i)).not.toBeInTheDocument()
  })

  it('renders accept and decline buttons for a trainer if there are actionable courses', () => {
    const TRAINER_PROFILE_ID = chance.guid()

    const actionableCourse = buildTrainerCourse({
      overrides: {
        status: Course_Status_Enum.TrainerPending,
        trainers: [
          {
            id: chance.guid(),
            profile: { id: TRAINER_PROFILE_ID },
            type: Course_Trainer_Type_Enum.Leader,
          },
        ],
      },
    })

    const client = {
      executeQuery: () => {
        return fromValue<{ data: TrainerCoursesQuery }>({
          data: {
            courses: [actionableCourse],
            course_aggregate: {
              aggregate: {
                count: 1,
              },
            },
          },
        })
      },
    } as unknown as Client

    _render(
      <Provider value={client}>
        <TrainerCourses />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          profile: { id: TRAINER_PROFILE_ID },
        },
      }
    )

    expect(screen.getByTestId('actionable-courses-table')).toBeInTheDocument()

    expect(screen.getByTestId('courses-table')).toBeInTheDocument()

    const actionableCourseRow = screen.getByTestId(
      `actionable-course-${actionableCourse.id}`
    )

    expect(within(actionableCourseRow).getByText(/accept/i)).toBeInTheDocument()
    expect(
      within(actionableCourseRow).getByText(/decline/i)
    ).toBeInTheDocument()
  })
})
