import { setMedia } from 'mock-match-media'
import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  UserCoursesQuery,
  UserCoursesQueryVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { AttendeeCourses } from './AttendeeCourses'
import { buildUserCourse } from './test-utils'

describe('user-pages/MyCourses', () => {
  it('filters by keyword', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()
    const KEYWORD = 'keyword'

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const conditions = variables.where?._or ?? []
        const courses =
          conditions[0]?.name?._ilike === `%${KEYWORD}%`
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.type(screen.getByPlaceholderText('Search'), KEYWORD)

    await waitFor(() => {
      expect(
        screen.queryByTestId(`course-row-${course.id}`)
      ).not.toBeInTheDocument()

      expect(
        screen.getByTestId(`course-row-${filteredCourse.id}`)
      ).toBeInTheDocument()
    })
  })

  it('filters by levels', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const courses =
          variables.where?.level?._in?.includes(Course_Level_Enum.Level_1) &&
          variables.where.level._in.includes(Course_Level_Enum.Level_2)
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
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

  it('should hide filters in participant context', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const courses =
          variables.where?.type?._in?.includes(Course_Type_Enum.Open) &&
          variables.where.type._in.includes(Course_Type_Enum.Closed)
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    expect(screen.queryByTestId('FilterCourseType')).not.toBeInTheDocument()
  })

  it('filters unattended courses', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const orCondition = variables.where?._or ?? [{}]

        const courses =
          orCondition[0].participants?.attended?._eq === false
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText('Unattended')
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

  it('filters courses that are missing H&S consent', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const orCondition = variables.where?._or ?? [{}]
        const participantsWhere = orCondition[0].participants

        const courses =
          participantsWhere?.attended?._is_null === true &&
          participantsWhere.healthSafetyConsent?._eq === false
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText(
        'Info required'
      )
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

  it('filters courses that have missing evaluation', async () => {
    const unevaluatedCourse = buildUserCourse()

    unevaluatedCourse.participants = [
      { ...unevaluatedCourse.participants[0], healthSafetyConsent: true },
    ]

    unevaluatedCourse.evaluation_answers_aggregate = {
      aggregate: {
        count: 0,
      },
    }

    const evaluatedCourse = buildUserCourse()

    evaluatedCourse.participants = [
      { ...unevaluatedCourse.participants[0], healthSafetyConsent: true },
    ]

    evaluatedCourse.evaluation_answers_aggregate = {
      aggregate: {
        count: 5,
      },
    }

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const orCondition = variables.where?._or ?? [{}]

        const courses = orCondition[0].id?._in?.includes(unevaluatedCourse.id)
          ? [unevaluatedCourse]
          : [evaluatedCourse, unevaluatedCourse]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText(
        'Missing evaluation'
      )
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId(`course-row-${evaluatedCourse.id}`)
      ).not.toBeInTheDocument()

      expect(
        screen.getByTestId(`course-row-${unevaluatedCourse.id}`)
      ).toBeInTheDocument()
    })
  })

  it('filters courses that are not graded yet', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const orCondition = variables.where?._or ?? [{}]
        const participantsWhere = orCondition[0].participants

        const courses =
          participantsWhere?.grade?._is_null === true
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText(
        'Missing grade'
      )
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

  it('filters courses that are scheduled (in future and with H&S consent)', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const orCondition = variables.where?._or ?? [{}]
        const participantsWhere = orCondition[0].participants
        const futureEndDateFilter =
          new Date().getDate() ===
          new Date(orCondition[0].schedule?.end?._gt).getDate()

        const courses =
          participantsWhere?.healthSafetyConsent?._eq === true &&
          futureEndDateFilter
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText('Scheduled')
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

  it('filters courses that are completed', async () => {
    const course = buildUserCourse()
    const filteredCourse = buildUserCourse()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const orCondition = variables.where?._or ?? [{}]

        const pastEndDateFilter =
          new Date().getDate() ===
          new Date(orCondition[0].schedule?.end?._lt).getDate()

        const courses =
          orCondition[0].participants?.grade?._is_null === false &&
          pastEndDateFilter
            ? [filteredCourse]
            : [course]

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
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

  it('filters by multiple statuses', async () => {
    const infoRequiredCourse = buildUserCourse()

    infoRequiredCourse.participants = [
      {
        ...infoRequiredCourse.participants[0],
        healthSafetyConsent: false,
        attended: null,
      },
    ]

    const unattendedCourse = buildUserCourse()

    unattendedCourse.participants = [
      { ...unattendedCourse.participants[0], attended: false },
    ]

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: UserCoursesQueryVariables
      }) => {
        const [infoRequiredWhere, unattendedWhere] = variables.where?._or ?? [
          {},
          {},
        ]

        const infoRequiredApplied =
          infoRequiredWhere?.participants?.healthSafetyConsent?._eq === false &&
          infoRequiredWhere?.participants.attended?._is_null === true

        const unattededApplied =
          unattendedWhere?.participants?.attended?._eq === false

        const courses =
          infoRequiredApplied && unattededApplied
            ? [infoRequiredCourse, unattendedCourse]
            : []

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
        <AttendeeCourses />
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText('Unattended')
    )
    userEvent.click(
      within(screen.getByTestId('FilterCourseStatus')).getByText(
        'Info required'
      )
    )

    await waitFor(() => {
      expect(
        screen.getByTestId(`course-row-${unattendedCourse.id}`)
      ).toBeInTheDocument()

      expect(
        screen.getByTestId(`course-row-${infoRequiredCourse.id}`)
      ).toBeInTheDocument()
    })
  })

  describe('Start and end dates filter', () => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

    const buildTrainerCourseWithDates = (
      start: Date,
      end: Date
    ): UserCoursesQuery['courses'][0] =>
      buildUserCourse({
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

    let course_from_15_01_23_to_27_11_23: UserCoursesQuery['courses'][0]
    let course_from_13_03_23_to_25_07_23: UserCoursesQuery['courses'][0]
    let course_from_22_03_23_to_20_12_23: UserCoursesQuery['courses'][0]
    let allCourses: UserCoursesQuery['courses']
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
          variables: UserCoursesQueryVariables
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
          <AttendeeCourses />
        </Provider>,
        {},
        { initialEntries: ['/'] }
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

      const from = within(screen.getByTestId('Range')).getByLabelText('From')
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
          variables: UserCoursesQueryVariables
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
          <AttendeeCourses />
        </Provider>,
        {},
        { initialEntries: ['/'] }
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

      const to = screen.queryAllByLabelText('To')
      userEvent.paste(to[0], '25/07/2023') // second course's end date

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
          variables: UserCoursesQueryVariables
        }) => {
          const conditions =
            variables.where?.schedule?._and?.filter(obj => {
              const keys = Object.keys(obj)
              return keys.includes('start') || keys.includes('end')
            }).length === 2 ?? false
          const courses = conditions
            ? [course_from_13_03_23_to_25_07_23]
            : allCourses

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
          <AttendeeCourses />
        </Provider>,
        {},
        { initialEntries: ['/'] }
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

      const from = within(screen.getByTestId('Range')).getByLabelText('From')
      userEvent.paste(from, '13/03/2023') // second course's start date

      const to = within(screen.getByTestId('Range')).getByLabelText('To')
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
})
