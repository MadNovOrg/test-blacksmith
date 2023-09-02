import { matches } from 'lodash-es'
import { Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Color_Enum,
  CourseToBuildQuery,
  CourseToBuildQueryVariables,
  Course_Level_Enum,
  FinalizeCourseBuilderMutationVariables,
  ModuleGroupsQuery,
  SaveCourseModulesMutation,
  SaveCourseModulesMutationVariables,
  SetCourseAsDraftMutationVariables,
} from '@app/generated/graphql'
import { FINALIZE_COURSE_BUILDER_MUTATION } from '@app/queries/courses/finalize-course-builder'
import { MUTATION as SAVE_COURSE_MODULES } from '@app/queries/courses/save-course-modules'

import { FinalizeCourseBuilderMutation } from '@qa/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { buildCourse, buildModuleGroup } from '../../test-utils'

import { ICMCourseBuilder } from './ICMCourseBuilder'
import { COURSE_QUERY, SET_COURSE_AS_DRAFT } from './queries'

describe('component: CourseBuilder', () => {
  describe('info alert for level 1 course', () => {
    const levelOneInfoMessage =
      /Additional intermediate modules that are not listed would need to be delivered as part of Level Two course./
    const levelTwoInfoMessage =
      /To deliver your course as a Level Two, you must include at least one of the following intermediate modules:/

    it('shows the info alert for level 1 course', async () => {
      const course = buildCourse({ level: Course_Level_Enum.Level_1 })

      const client = {
        executeQuery: ({ query }: { query: TypedDocumentNode }) => {
          if (query === COURSE_QUERY) {
            return fromValue<{ data: CourseToBuildQuery }>({
              data: {
                course,
              },
            })
          }

          return fromValue<{ data: ModuleGroupsQuery }>({
            data: {
              groups: [],
            },
          })
        },
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/:id/modules" element={<ICMCourseBuilder />} />
          </Routes>
        </Provider>,
        {},
        {
          initialEntries: [`/courses/${course.id}/modules`],
        }
      )

      expect(screen.getByText(levelOneInfoMessage)).toBeInTheDocument()
    })

    it('hides the info alert for level 2 course', async () => {
      const course = buildCourse({
        level: Course_Level_Enum.Level_2,
      })

      const client = {
        executeQuery: ({ query }: { query: TypedDocumentNode }) => {
          if (query === COURSE_QUERY) {
            return fromValue<{ data: CourseToBuildQuery }>({
              data: {
                course,
              },
            })
          }

          return fromValue<{ data: ModuleGroupsQuery }>({
            data: {
              groups: [],
            },
          })
        },
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/:id/modules" element={<ICMCourseBuilder />} />
          </Routes>
        </Provider>,
        {},
        {
          initialEntries: [`/courses/${course.id}/modules`],
        }
      )

      expect(screen.queryByText(levelTwoInfoMessage)).toBeInTheDocument()
    })
  })

  it('shows a spinner while loading course and modules', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilder />
      </Provider>
    )

    expect(
      screen.getByRole('progressbar', { name: /course fetching/i })
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it("displays not found page if a course doesn't exist", () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course: null,
            },
          })
        }

        return fromValue<{ data: ModuleGroupsQuery }>({
          data: {
            groups: [],
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilder />
      </Provider>
    )

    expect(screen.getByText(/course not found/i)).toBeInTheDocument()
  })

  it('displays an alert if there is an error fetching course or module groups', () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_QUERY) {
          return fromValue({
            error: new CombinedError({
              networkError: Error('something went wrong!'),
            }),
          })
        }

        return fromValue<{ data: ModuleGroupsQuery }>({
          data: {
            groups: [],
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilder />
      </Provider>
    )

    const alert = screen.getByRole('alert')
    expect(alert.textContent).toMatchInlineSnapshot(
      `"Internal error occurred."`
    )
  })

  it('displays course information properly', () => {
    const course = buildCourse({
      isDraft: true,
      organization: { name: 'Organization' },
      start: '2023-07-28T09:00Z',
      end: '2023-07-28T17:00Z',
      schedule: [{ venue: { name: 'Venue', city: 'City' } }],
    })

    const client = {
      executeQuery: ({
        query,
        variables,
      }: {
        query: TypedDocumentNode
        variables: CourseToBuildQueryVariables
      }) => {
        if (query === COURSE_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course: variables.id === course.id ? course : null,
            },
          })
        }

        return fromValue<{ data: ModuleGroupsQuery }>({
          data: {
            groups: [],
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/:id/modules" element={<ICMCourseBuilder />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/${course.id}/modules`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    expect(screen.getByTestId('course-status-chip').textContent).toBe('Draft')

    expect(
      screen.getByTestId('course-organization').textContent
    ).toMatchInlineSnapshot(`"Organisation: Organization"`)
    expect(
      screen.getByTestId('course-location').textContent
    ).toMatchInlineSnapshot(`"Location: Venue, City"`)
    expect(
      screen.getByTestId('course-start-date').textContent
    ).toMatchInlineSnapshot(`"Starts: 28 July 2023, 10:00 AM"`)
    expect(
      screen.getByTestId('course-end-date').textContent
    ).toMatchInlineSnapshot(`"Ends: 28 July 2023, 06:00 PM"`)
  })

  it('saves course as draft and saves chosen modules when a module group is clicked', async () => {
    const course = buildCourse()
    const moduleGroup = buildModuleGroup()

    let draftSaved = false
    let modulesSaved = false

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        return fromValue<{ data: ModuleGroupsQuery }>({
          data: {
            groups: [moduleGroup],
          },
        })
      },
      executeMutation: ({
        query,
        variables,
      }: {
        query: TypedDocumentNode
        variables:
          | SetCourseAsDraftMutationVariables
          | SaveCourseModulesMutationVariables
      }) => {
        const draftMutationMatches = matches({
          variables: { id: course.id },
        })

        const modulesMutationMatches = matches({
          variables: {
            courseId: course.id,
            modules: moduleGroup.modules.map(module => ({
              courseId: course.id,
              moduleId: module.id,
            })),
          },
        })

        if (query === SET_COURSE_AS_DRAFT) {
          draftSaved = draftMutationMatches({ variables })

          return never
        }

        if (query === SAVE_COURSE_MODULES) {
          modulesSaved = modulesMutationMatches({ query, variables })
          return never
        }

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilder />
      </Provider>
    )

    const availableModules = screen.getByTestId('available-modules')
    const selectedModules = screen.getByTestId('selected-modules')

    const moduleGroupLabel = within(availableModules).getByLabelText(
      moduleGroup.name,
      {
        exact: false,
      }
    )

    expect(
      within(selectedModules).queryByTestId(
        `selected-module-group-${moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    await userEvent.click(moduleGroupLabel)

    expect(
      within(selectedModules).getByText(moduleGroup.name)
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(draftSaved).toBe(true)
      expect(modulesSaved).toBe(true)
    })
  })

  it('submits the course with module groups and navigates to the course details page', async () => {
    const course = buildCourse({ level: Course_Level_Enum.Advanced })
    const moduleGroup = buildModuleGroup()

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        return fromValue<{ data: ModuleGroupsQuery }>({
          data: {
            groups: [moduleGroup],
          },
        })
      },
      executeMutation: ({
        query,
        variables,
      }: {
        query: TypedDocumentNode
        variables: FinalizeCourseBuilderMutationVariables
      }) => {
        const mutationMatches = matches({
          query: FINALIZE_COURSE_BUILDER_MUTATION,
          variables: {
            id: course.id,
            duration: moduleGroup.duration.aggregate?.sum?.duration,
            status: null,
          },
        })

        if (mutationMatches({ query, variables })) {
          return fromValue<{ data: FinalizeCourseBuilderMutation }>({
            data: {
              update_course_by_pk: {
                id: course.id,
              },
            },
          })
        }

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="courses/:id">
            <Route path="modules" element={<ICMCourseBuilder />} />
            <Route path="details" element={<p>Course details</p>} />
          </Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/${course.id}/modules`] }
    )

    const availableModules = screen.getByTestId('available-modules')
    const selectedModules = screen.getByTestId('selected-modules')

    const moduleGroupLabel = within(availableModules).getByLabelText(
      moduleGroup.name,
      {
        exact: false,
      }
    )

    expect(
      within(selectedModules).queryByTestId(
        `selected-module-group-${moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    await userEvent.click(moduleGroupLabel)
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    const timeCommitmentDialog = screen.getByTestId('time-commitment-dialog')

    await userEvent.click(
      within(timeCommitmentDialog).getByText(/submit course/i)
    )

    await waitFor(() => {
      expect(screen.getByText(/course details/i)).toBeInTheDocument()
    })
  })

  it('displays mandatory module groups as pre-selected and disabled', () => {
    const course = buildCourse({ level: Course_Level_Enum.Advanced })
    const moduleGroup = buildModuleGroup({ mandatory: true })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        return fromValue<{ data: ModuleGroupsQuery }>({
          data: {
            groups: [moduleGroup],
          },
        })
      },
      executeMutation: () => {
        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilder />
      </Provider>,
      {},
      { initialEntries: [`/courses/${course.id}/modules`] }
    )

    const availableModules = screen.getByTestId('available-modules')
    const selectedModules = screen.getByTestId('selected-modules')

    const moduleGroupLabel = within(availableModules).getByLabelText(
      moduleGroup.name,
      {
        exact: false,
      }
    )

    expect(moduleGroupLabel).toBeDisabled()

    expect(
      within(selectedModules).queryByTestId(
        `selected-module-group-${moduleGroup.id}`
      )
    ).toBeInTheDocument()
  })

  it('displays already saved modules as preselected', () => {
    const moduleGroup = buildModuleGroup({ mandatory: false })
    const course = buildCourse({
      level: Course_Level_Enum.Advanced,
      moduleGroupIds: [{ module: { moduleGroup: { id: moduleGroup.id } } }],
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        return fromValue<{ data: ModuleGroupsQuery }>({
          data: {
            groups: [moduleGroup],
          },
        })
      },
      executeMutation: () => {
        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilder />
      </Provider>,
      {},
      { initialEntries: [`/courses/${course.id}/modules`] }
    )

    const availableModules = screen.getByTestId('available-modules')
    const selectedModules = screen.getByTestId('selected-modules')

    const moduleGroupLabel = within(availableModules).getByLabelText(
      moduleGroup.name,
      {
        exact: false,
      }
    )

    expect(moduleGroupLabel).toBeChecked()

    expect(
      within(selectedModules).queryByTestId(
        `selected-module-group-${moduleGroup.id}`
      )
    ).toBeInTheDocument()
  })

  /**
   * TODO Write proper unit tests to cover for purple modules scenario
   */
  it.each([Course_Level_Enum.Level_1, Course_Level_Enum.Level_2])(
    `marks all module groups as mandatory if course type is open and %s`,
    async level => {
      const moduleGroup = buildModuleGroup({
        color: Color_Enum.Purple,
      })
      const course = buildCourse({
        level,
        moduleGroupIds: [
          {
            module: {
              moduleGroup: {
                id: moduleGroup.id,
              },
            },
          },
        ],
      })

      const client = {
        executeQuery: ({ query }: { query: TypedDocumentNode }) => {
          if (query === COURSE_QUERY) {
            return fromValue<{ data: CourseToBuildQuery }>({
              data: {
                course,
              },
            })
          }

          return fromValue<{ data: ModuleGroupsQuery }>({
            data: {
              groups: [moduleGroup],
            },
          })
        },
        executeMutation: ({
          query,
          variables,
        }: {
          query: TypedDocumentNode
          variables: FinalizeCourseBuilderMutationVariables
        }) => {
          const finalizeMutationMatches = matches({
            variables: {
              id: course.id,
              duration: moduleGroup.duration.aggregate?.sum?.duration,
              status: null,
            },
          })

          const saveModulesMutationMatches = matches({
            variables: {
              courseId: course.id,
              modules: moduleGroup.modules.map(module => ({
                courseId: course.id,
                moduleId: module.id,
              })),
            },
          })

          if (
            query === FINALIZE_COURSE_BUILDER_MUTATION &&
            finalizeMutationMatches({ variables })
          ) {
            return fromValue<{ data: FinalizeCourseBuilderMutation }>({
              data: {
                update_course_by_pk: {
                  id: course.id,
                },
              },
            })
          }

          if (
            query === SAVE_COURSE_MODULES &&
            saveModulesMutationMatches({ variables })
          ) {
            return fromValue<{ data: SaveCourseModulesMutation }>({
              data: {
                inserted: {
                  count: moduleGroup.modules.length,
                },
                deleted: {
                  count: 0,
                },
              },
            })
          }

          return never
        },
      } as unknown as Client

      render(
        <Provider value={client}>
          <Routes>
            <Route path="courses/:id">
              <Route path="modules" element={<ICMCourseBuilder />} />
              <Route path="details" element={<p>Course details</p>} />
            </Route>
          </Routes>
        </Provider>,
        {},
        { initialEntries: [`/courses/${course.id}/modules`] }
      )

      const availableModules = screen.getByTestId('available-modules')
      const selectedModules = screen.getByTestId('selected-modules')

      const moduleGroupLabel = within(availableModules).getByLabelText(
        moduleGroup.name,
        {
          exact: false,
        }
      )

      expect(moduleGroupLabel).toBeDisabled()

      expect(
        within(selectedModules).queryByTestId(
          `selected-module-group-${moduleGroup.id}`
        )
      ).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: /submit/i }))

      const timeCommitmentDialog = screen.getByTestId('time-commitment-dialog')
      await userEvent.click(
        within(timeCommitmentDialog).getByText(/submit course/i)
      )

      await waitFor(() => {
        expect(screen.getByText(/course details/i)).toBeInTheDocument()
      })
    }
  )
})
