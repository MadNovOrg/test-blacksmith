import { Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  CourseToBuildQuery,
  CourseToBuildQueryVariables,
  ModuleSettingsQuery,
} from '@app/generated/graphql'

import { fireEvent, render, screen, within } from '@test/index'

import { COURSE_TO_BUILD_QUERY } from '../../hooks/useCourseToBuild'
import { buildCourse, buildModuleSetting } from '../../test-utils'

import { MODULE_SETTINGS_QUERY } from './hooks/useModuleSettings'
import { ICMCourseBuilderV2 } from './ICMCourseBuilderV2'

it('displays loading spinner while loading for course', () => {
  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return never
      }

      if (query === MODULE_SETTINGS_QUERY) {
        return fromValue<{ data: ModuleSettingsQuery }>({
          data: {
            moduleSettings: [],
          },
        })
      }
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>
  )

  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

it('displays loading spinner while loading for module settings', () => {
  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course: buildCourse(),
          },
        })
      }

      if (query === MODULE_SETTINGS_QUERY) {
        return never
      }
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>
  )

  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

it('displays not found page if course is not found', () => {
  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course: null,
          },
        })
      }

      if (query === MODULE_SETTINGS_QUERY) {
        return never
      }
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>
  )

  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  expect(screen.getByText(/not found/i)).toBeInTheDocument()
})

it('displays an alert if there is an error fetching course', () => {
  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue({
          error: new CombinedError({
            networkError: Error('something went wrong!'),
          }),
        })
      }

      if (query === MODULE_SETTINGS_QUERY) {
        return fromValue<{ data: ModuleSettingsQuery }>({
          data: {
            moduleSettings: [],
          },
        })
      }
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>
  )

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"Internal error occurred."`
  )
})

it('displays an alert if there is an error fetching module settings', () => {
  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue<{ data: CourseToBuildQuery }>({
          data: { course: buildCourse() },
        })
      }

      if (query === MODULE_SETTINGS_QUERY) {
        return fromValue({
          error: new CombinedError({
            networkError: Error('something went wrong!'),
          }),
        })
      }
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>
  )

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"Internal error occurred."`
  )
})

const level1Message =
  /Additional intermediate modules that are not listed would need to be delivered as part of Level Two course./i

const level2Message =
  /To deliver your course as a Level Two, you must include at least one of the following intermediate modules/i

const advancedMessage =
  /Should the estimated duration equal less than 6 hours, then the course must still be delivered over the minimum 6-hour period/i

it.each([
  [Course_Type_Enum.Closed, Course_Level_Enum.Level_1, level1Message],
  [Course_Type_Enum.Closed, Course_Level_Enum.Level_2, level2Message],
  [Course_Type_Enum.Closed, Course_Level_Enum.Advanced, advancedMessage],
  [Course_Type_Enum.Indirect, Course_Level_Enum.Level_1, level1Message],
  [Course_Type_Enum.Indirect, Course_Level_Enum.Level_2, level2Message],
  [Course_Type_Enum.Indirect, Course_Level_Enum.Advanced, advancedMessage],
])(
  'displays an info alert regarding modules for %s course type and %s course',
  (type, level, content) => {
    const course = buildCourse({
      level,
      type,
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_TO_BUILD_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilderV2 />
      </Provider>
    )

    expect(screen.getByTestId('modules-alert')).toHaveTextContent(content)
  }
)

it.each([
  [Course_Type_Enum.Open, Course_Level_Enum.Level_1],
  [Course_Type_Enum.Open, Course_Level_Enum.Level_2],
  [Course_Type_Enum.Open, Course_Level_Enum.Advanced],
])(
  'hides modules info alert for %s course type and %s courses',
  (type, level) => {
    const course = buildCourse({
      level,
      type,
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_TO_BUILD_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        if (query === MODULE_SETTINGS_QUERY) {
          return fromValue<{ data: ModuleSettingsQuery }>({
            data: {
              moduleSettings: [],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilderV2 />
      </Provider>
    )

    expect(screen.queryByTestId('modules-alert')).not.toBeInTheDocument()
  }
)

it('displays course information properly', () => {
  const course = buildCourse({
    isDraft: true,
    organization: { name: 'Organization' },
    start: '2023-07-28T09:00Z',
    end: '2023-07-28T17:00Z',
    schedule: [
      { timeZone: 'GMT+00:00', venue: { name: 'Venue', city: 'City' } },
    ],
  })

  const client = {
    executeQuery: ({
      query,
      variables,
    }: {
      query: TypedDocumentNode
      variables: CourseToBuildQueryVariables
    }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course: variables.id === course.id ? course : null,
          },
        })
      }

      return fromValue<{ data: ModuleSettingsQuery }>({
        data: {
          moduleSettings: [],
        },
      })
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path="/courses/:id/modules" element={<ICMCourseBuilderV2 />} />
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

it('displays mandatory modules as pre-selected and disabled', () => {
  const course = buildCourse({
    level: Course_Level_Enum.Advanced,
    type: Course_Type_Enum.Closed,
  })

  const mandatoryModule = buildModuleSetting({ mandatory: true })
  const nonMandatoryModule = buildModuleSetting({ mandatory: false })

  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course,
          },
        })
      }

      return fromValue<{ data: ModuleSettingsQuery }>({
        data: {
          moduleSettings: [mandatoryModule, nonMandatoryModule],
        },
      })
    },
    executeMutation: () => {
      return never
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>,
    {},
    { initialEntries: [`/courses/${course.id}/modules`] }
  )

  const availableModules = screen.getByTestId('available-modules')
  const selectedModules = screen.getByTestId('selected-modules')

  const moduleGroupLabel = within(availableModules).getByLabelText(
    mandatoryModule.module.name,
    {
      exact: false,
    }
  )

  expect(moduleGroupLabel).toBeDisabled()

  expect(
    within(selectedModules).queryByTestId(
      `selected-module-group-${mandatoryModule.module.id}`
    )
  ).toBeInTheDocument()
})

it('displays already saved modules as preselected', () => {
  const moduleSetting = buildModuleSetting({ mandatory: false })
  const course = buildCourse({
    level: Course_Level_Enum.Advanced,
    curriculum: [moduleSetting.module],
  })

  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course,
          },
        })
      }

      return fromValue<{ data: ModuleSettingsQuery }>({
        data: {
          moduleSettings: [moduleSetting],
        },
      })
    },
    executeMutation: () => {
      return never
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>,
    {},
    { initialEntries: [`/courses/${course.id}/modules`] }
  )

  const availableModules = screen.getByTestId('available-modules')
  const selectedModules = screen.getByTestId('selected-modules')

  const moduleGroupLabel = within(availableModules).getByLabelText(
    moduleSetting.module.name,
    {
      exact: false,
    }
  )

  expect(moduleGroupLabel).toBeChecked()

  expect(
    within(selectedModules).queryByTestId(
      `selected-module-group-${moduleSetting.module.id}`
    )
  ).toBeInTheDocument()
})

it.each([
  Course_Level_Enum.IntermediateTrainer,
  Course_Level_Enum.AdvancedTrainer,
  Course_Level_Enum.ThreeDaySafetyResponseTrainer,
])(
  'does not display the course estimated duration for %s course (if not OPEN)',
  level => {
    const course = buildCourse({
      level,
      type: Course_Type_Enum.Closed,
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_TO_BUILD_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        return fromValue<{ data: ModuleSettingsQuery }>({
          data: {
            moduleSettings: [],
          },
        })
      },
      executeMutation: () => {
        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilderV2 />
      </Provider>,
      {},
      { initialEntries: [`/courses/${course.id}/modules`] }
    )

    expect(
      screen.queryByTestId('course-estimated-duration')
    ).not.toBeInTheDocument()
  }
)

it.each([true, false])(
  'does not display the course estimated duration for 3 Day SRT and reaccreditation %s course',
  reaccreditation => {
    const course = buildCourse({
      level: Course_Level_Enum.ThreeDaySafetyResponseTrainer,
      type: Course_Type_Enum.Open,
      reaccreditation,
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_TO_BUILD_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        return fromValue<{ data: ModuleSettingsQuery }>({
          data: {
            moduleSettings: [],
          },
        })
      },
      executeMutation: () => {
        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilderV2 />
      </Provider>,
      {},
      { initialEntries: [`/courses/${course.id}/modules`] }
    )

    expect(
      screen.queryByTestId('course-estimated-duration')
    ).not.toBeInTheDocument()
  }
)

it.each([true, false])(
  'does not display the time commitment warning modal for 3 Day SRT and reaccreditation %s course',
  reaccreditation => {
    const moduleSettings = Array.from({ length: 10 }, () =>
      buildModuleSetting({
        duration: 120,
        mandatory: true,
      })
    )

    const course = buildCourse({
      level: Course_Level_Enum.ThreeDaySafetyResponseTrainer,
      type: Course_Type_Enum.Open,
      reaccreditation,
    })

    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === COURSE_TO_BUILD_QUERY) {
          return fromValue<{ data: CourseToBuildQuery }>({
            data: {
              course,
            },
          })
        }

        return fromValue<{ data: ModuleSettingsQuery }>({
          data: {
            moduleSettings,
          },
        })
      },
      executeMutation: () => {
        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <ICMCourseBuilderV2 />
      </Provider>,
      {},
      { initialEntries: [`/courses/${course.id}/modules`] }
    )

    fireEvent.click(screen.getByTestId('submit-button'))

    expect(
      screen.queryByTestId('time-commitment-dialog')
    ).not.toBeInTheDocument()
  }
)

it.each([
  Course_Level_Enum.Level_1,
  Course_Level_Enum.Level_2,
  Course_Level_Enum.Advanced,
])('displays the course estimated duration for %s course', level => {
  const course = buildCourse({
    level,
    type: Course_Type_Enum.Closed,
  })

  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue<{ data: CourseToBuildQuery }>({
          data: {
            course,
          },
        })
      }

      return fromValue<{ data: ModuleSettingsQuery }>({
        data: {
          moduleSettings: [],
        },
      })
    },
    executeMutation: () => {
      return never
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <ICMCourseBuilderV2 />
    </Provider>,
    {},
    { initialEntries: [`/courses/${course.id}/modules`] }
  )

  expect(screen.getByTestId('course-estimated-duration')).toBeInTheDocument()
})
