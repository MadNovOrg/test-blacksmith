/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect*"] }] */
import { setMedia } from 'mock-match-media'
import React from 'react'
import { getI18n } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Accreditors_Enum,
  Course_Bool_Exp,
  Course_Delivery_Type_Enum,
  Course_Invite_Status_Enum,
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  Order_By,
  SetCourseTrainerStatusMutation,
  TrainerCourseFragment,
  TrainerCoursesQuery,
  TrainerCoursesQueryVariables,
} from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import {
  buildTrainerCourse,
  buildActionableTrainerCourse,
  buildActionableTrainerCourseWithDates,
  expectActionableTableTo,
  expectCourseTableTo,
  buildCourseTrainer,
} from './test-utils'
import { TrainerCourses } from './TrainerCourses'

const { t } = getI18n()
const blendedLearningLabel = t('common.blended-learning')

describe('trainers-pages/MyCourses', () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

  describe('Actionable courses table', () => {
    const TRAINER_PROFILE_ID = chance.guid()

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

      render(
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
      const actionableCourse = buildActionableTrainerCourse({
        trainers: [buildCourseTrainer({ profile: { id: TRAINER_PROFILE_ID } })],
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

      render(
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

      expect(
        within(actionableCourseRow).getByText(/accept/i)
      ).toBeInTheDocument()
      expect(
        within(actionableCourseRow).getByText(/decline/i)
      ).toBeInTheDocument()
    })

    it("doesn't redirect trainer to course builder after declining the course invite", async () => {
      const actionableCourse = buildActionableTrainerCourse({
        trainers: [buildCourseTrainer({ profile: { id: TRAINER_PROFILE_ID } })],
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
        executeMutation: () =>
          fromValue<{ data: SetCourseTrainerStatusMutation }>({
            data: {
              update_course_trainer_by_pk: {
                id: chance.guid(),
                status: Course_Invite_Status_Enum.Declined,
              },
            },
          }),
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="courses" element={<TrainerCourses />} />
            <Route path="course/:id/modules" element={<p>course builder</p>} />
          </Routes>
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TRAINER,
            profile: { id: TRAINER_PROFILE_ID },
          },
        },
        { initialEntries: [`/courses`] }
      )

      const actionableCourseRow = screen.getByTestId(
        `actionable-course-${actionableCourse.id}`
      )

      await userEvent.click(within(actionableCourseRow).getByText(/decline/i))

      const declineInviteDialog = screen.getByRole('dialog')

      await userEvent.click(
        within(declineInviteDialog).getByRole('button', { name: /decline/i })
      )

      expect(screen.queryByText(/course builder/i)).not.toBeInTheDocument()
    })

    it('redirects to the course builder when a lead trainer accepts the invite', async () => {
      const actionableCourse = buildActionableTrainerCourse({
        trainers: [buildCourseTrainer({ profile: { id: TRAINER_PROFILE_ID } })],
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
        executeMutation: () =>
          fromValue<{ data: SetCourseTrainerStatusMutation }>({
            data: {
              update_course_trainer_by_pk: {
                id: chance.guid(),
                status: Course_Invite_Status_Enum.Accepted,
              },
            },
          }),
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="courses" element={<TrainerCourses />} />
            <Route path="courses/:id/modules" element={<p>course builder</p>} />
          </Routes>
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TRAINER,
            profile: { id: TRAINER_PROFILE_ID },
          },
        },
        { initialEntries: [`/courses`] }
      )

      const actionableCourseRow = screen.getByTestId(
        `actionable-course-${actionableCourse.id}`
      )

      await userEvent.click(within(actionableCourseRow).getByText(/accept/i))

      const declineInviteDialog = screen.getByRole('dialog')

      await userEvent.click(
        within(declineInviteDialog).getByRole('button', {
          name: /continue to course builder/i,
        })
      )

      expect(screen.getByText(/course builder/i)).toBeInTheDocument()
    })

    it('redirects to the course details when an assist trainer accepts the invite', async () => {
      const actionableCourse = buildActionableTrainerCourse({
        trainers: [
          buildCourseTrainer({
            profile: { id: TRAINER_PROFILE_ID },
            type: Course_Trainer_Type_Enum.Assistant,
          }),
        ],
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
        executeMutation: () =>
          fromValue<{ data: SetCourseTrainerStatusMutation }>({
            data: {
              update_course_trainer_by_pk: {
                id: chance.guid(),
                status: Course_Invite_Status_Enum.Accepted,
              },
            },
          }),
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="courses" element={<TrainerCourses />} />
            <Route path="courses/:id/details" element={<p>course details</p>} />
          </Routes>
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TRAINER,
            profile: { id: TRAINER_PROFILE_ID },
          },
        },
        { initialEntries: [`/courses`] }
      )

      const actionableCourseRow = screen.getByTestId(
        `actionable-course-${actionableCourse.id}`
      )

      await userEvent.click(within(actionableCourseRow).getByText(/accept/i))

      const dialog = screen.getByRole('dialog')

      await userEvent.click(
        within(dialog).getByRole('button', {
          name: /accept/i,
        })
      )

      expect(screen.getByText(/course details/i)).toBeInTheDocument()
    })

    it('redirects to the course details when a moderator  accepts the invite', async () => {
      const actionableCourse = buildActionableTrainerCourse({
        trainers: [
          buildCourseTrainer({
            profile: { id: TRAINER_PROFILE_ID },
            type: Course_Trainer_Type_Enum.Moderator,
          }),
        ],
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
        executeMutation: () =>
          fromValue<{ data: SetCourseTrainerStatusMutation }>({
            data: {
              update_course_trainer_by_pk: {
                id: chance.guid(),
                status: Course_Invite_Status_Enum.Accepted,
              },
            },
          }),
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="courses" element={<TrainerCourses />} />
            <Route path="courses/:id/details" element={<p>course details</p>} />
          </Routes>
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TRAINER,
            profile: { id: TRAINER_PROFILE_ID },
          },
        },
        { initialEntries: [`/courses`] }
      )

      const actionableCourseRow = screen.getByTestId(
        `actionable-course-${actionableCourse.id}`
      )

      await userEvent.click(within(actionableCourseRow).getByText(/accept/i))

      const dialog = screen.getByRole('dialog')

      await userEvent.click(
        within(dialog).getByRole('button', {
          name: /accept/i,
        })
      )

      expect(screen.getByText(/course details/i)).toBeInTheDocument()
    })

    it('sorts courses by name', async () => {
      const courses = [
        buildActionableTrainerCourse({
          trainers: [
            buildCourseTrainer({ profile: { id: TRAINER_PROFILE_ID } }),
          ],
        }),
        buildActionableTrainerCourse({
          trainers: [
            buildCourseTrainer({ profile: { id: TRAINER_PROFILE_ID } }),
          ],
        }),
      ]
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
              courses:
                orderBy.name === Order_By.Asc ? courses : reversedCourses,
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

      const actionableTbl = screen.getByTestId('actionable-courses-table')

      await waitFor(() => {
        expect(within(actionableTbl).getByText('Name')).toBeVisible()
      })

      userEvent.click(within(actionableTbl).getByText('Name'))

      await waitFor(
        () => {
          expect(
            within(actionableTbl).getByTestId(
              `actionable-course-${courses[0].id}`
            )
          ).toHaveAttribute('data-index', '0')
        },
        {
          timeout: 2000,
          interval: 200,
        }
      )
    })

    it('filters by search', async () => {
      const keyword = '20123'
      const TRAINER_PROFILE_ID = chance.guid()

      const filteredCourse = buildActionableTrainerCourse({
        course_code: `OP-L1-${keyword}`,
        trainers: [buildCourseTrainer({ profile: { id: TRAINER_PROFILE_ID } })],
      })

      const course = buildActionableTrainerCourse({
        course_code: 'OP-L1-20001',
        trainers: [buildCourseTrainer({ profile: { id: TRAINER_PROFILE_ID } })],
      })

      const client = {
        executeQuery: ({
          variables,
        }: {
          variables: TrainerCoursesQueryVariables
        }) => {
          const conditions: Course_Bool_Exp['_or'] = variables.where?._or ?? []
          const courseCodeCondition = conditions.find(cond =>
            Object.keys(cond).includes('course_code')
          )
          const courses =
            courseCodeCondition?.course_code?._ilike === `%${keyword}%`
              ? [filteredCourse]
              : [filteredCourse, course]

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

      const actionableTbl = screen.getByTestId('actionable-courses-table')
      await expectActionableTableTo({
        table: actionableTbl,
        include: [course, filteredCourse],
      })

      const search = screen.getByTestId('FilterSearch-Input')
      await userEvent.type(search, keyword)

      await expectActionableTableTo({
        table: actionableTbl,
        include: [filteredCourse],
        exclude: [course],
      })
    })

    describe('Start and end dates filter', () => {
      setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

      let course_from_15_01_23_to_27_11_23: TrainerCourseFragment
      let course_from_13_03_23_to_25_07_23: TrainerCourseFragment
      let course_from_22_03_23_to_20_12_23: TrainerCourseFragment
      let allCourses: TrainerCourseFragment[]
      beforeAll(() => {
        // 15/01/2023 - 27/11/2023
        course_from_15_01_23_to_27_11_23 =
          buildActionableTrainerCourseWithDates(
            new Date(2023, 0, 15),
            new Date(2023, 10, 27)
          )
        // 13/03/2023 - 25/07/2023
        course_from_13_03_23_to_25_07_23 =
          buildActionableTrainerCourseWithDates(
            new Date(2023, 2, 13),
            new Date(2023, 6, 25)
          )
        // 22/03/2023 - 20/12/2023
        course_from_22_03_23_to_20_12_23 =
          buildActionableTrainerCourseWithDates(
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

        const actionableTbl = screen.getByTestId('actionable-courses-table')
        await expectActionableTableTo({
          table: actionableTbl,
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

        userEvent.paste('13/03/2023') // second course's start date

        await expectActionableTableTo({
          table: actionableTbl,
          exclude: [course_from_15_01_23_to_27_11_23],
          include: [
            course_from_13_03_23_to_25_07_23,
            course_from_22_03_23_to_20_12_23,
          ],
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
        const actionableTbl = screen.getByTestId('actionable-courses-table')

        await expectActionableTableTo({
          table: actionableTbl,
          include: [
            course_from_15_01_23_to_27_11_23,
            course_from_13_03_23_to_25_07_23,
            course_from_22_03_23_to_20_12_23,
          ],
        })

        const to = within(screen.getByTestId('date-range')).getByLabelText('To')

        to.focus()
        userEvent.paste('25/07/2023') // second course's end date

        await expectActionableTableTo({
          table: actionableTbl,
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
        const actionableTbl = screen.getByTestId('actionable-courses-table')
        await expectActionableTableTo({
          table: actionableTbl,
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
        userEvent.paste('13/03/2023') // second course's start date

        const to = within(screen.getByTestId('date-range')).getByLabelText('To')

        to.focus()
        userEvent.paste('25/07/2023') // second course's end date

        await expectActionableTableTo({
          table: actionableTbl,
          include: [course_from_13_03_23_to_25_07_23],
          exclude: [
            course_from_15_01_23_to_27_11_23,
            course_from_22_03_23_to_20_12_23,
          ],
        })
      })
    })

    it('filters by blended learning', async () => {
      const courseWithBlendedLearning = buildActionableTrainerCourse({
        go1Integration: true,
      })
      const courseWithoutBlendedLearning = buildActionableTrainerCourse()

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

      const actionableTbl = screen.getByTestId('actionable-courses-table')
      await expectActionableTableTo({
        table: actionableTbl,
        include: [courseWithBlendedLearning, courseWithoutBlendedLearning],
      })

      const blendedLearningFilter = screen.getByLabelText(blendedLearningLabel)
      userEvent.click(blendedLearningFilter)

      await expectActionableTableTo({
        table: actionableTbl,
        include: [courseWithBlendedLearning],
        exclude: [courseWithoutBlendedLearning],
      })
    })

    it('filters by level', async () => {
      const course = buildActionableTrainerCourse({
        level: Course_Level_Enum.Advanced,
      })
      const filteredCourse = buildActionableTrainerCourse({
        level: Course_Level_Enum.Level_2,
      })

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

      const actionableTbl = screen.getByTestId('actionable-courses-table')
      await expectActionableTableTo({
        table: actionableTbl,
        include: [course],
        exclude: [filteredCourse],
      })

      userEvent.click(
        within(screen.getByTestId('FilterByCourseLevel')).getByText('Level One')
      )
      userEvent.click(
        within(screen.getByTestId('FilterByCourseLevel')).getByText('Level Two')
      )

      await expectActionableTableTo({
        table: actionableTbl,
        include: [filteredCourse],
        exclude: [course],
      })
    })

    it('filters by type', async () => {
      const course = buildActionableTrainerCourse({
        type: Course_Type_Enum.Indirect,
      })
      const filteredCourse = buildActionableTrainerCourse({
        type: Course_Type_Enum.Open,
      })

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

      const actionableTbl = screen.getByTestId('actionable-courses-table')
      await expectActionableTableTo({
        table: actionableTbl,
        include: [course],
        exclude: [filteredCourse],
      })

      userEvent.click(
        within(screen.getByTestId('FilterByCourseType')).getByText('Open')
      )
      userEvent.click(
        within(screen.getByTestId('FilterByCourseType')).getByText('Closed')
      )

      await expectActionableTableTo({
        table: actionableTbl,
        include: [filteredCourse],
        exclude: [course],
      })
    })

    it('filters by accredited by', async () => {
      const course = buildTrainerCourse()
      const filteredCourse = buildTrainerCourse()

      const client = {
        executeQuery: ({
          variables,
        }: {
          variables: TrainerCoursesQueryVariables
        }) => {
          const courses = variables.where?.accreditedBy?._in?.includes(
            Accreditors_Enum.Bild
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
        within(screen.getByTestId('filter-accredited-by')).getByText('BILD')
      )

      const table = screen.getByTestId('courses-table')
      await expectCourseTableTo({
        table,
        include: [filteredCourse],
        exclude: [course],
      })
    })

    it('filters by delivery type', async () => {
      const course = buildActionableTrainerCourse()
      const filteredCourse = buildActionableTrainerCourse()

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

      const actionableTbl = screen.getByTestId('actionable-courses-table')
      await expectActionableTableTo({
        table: actionableTbl,
        include: [course],
        exclude: [filteredCourse],
      })

      await userEvent.click(
        within(screen.getByTestId('FilterByCourseDeliveryType')).getByText(
          'Virtual'
        )
      )

      await expectActionableTableTo({
        table: actionableTbl,
        include: [filteredCourse],
        exclude: [course],
      })
    })
  })
})
