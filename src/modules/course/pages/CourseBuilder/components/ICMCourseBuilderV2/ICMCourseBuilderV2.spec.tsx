import { matches } from 'lodash'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Color_Enum,
  CourseToBuildQuery,
  Course_Level_Enum,
  Course_Type_Enum,
  ModuleSettingsQuery,
  SaveIcmCourseDraftMutation,
  SaveIcmCourseDraftMutationVariables,
  SubmitIcmModulesMutation,
  SubmitIcmModulesMutationVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { COURSE_TO_BUILD_QUERY } from '../../hooks/useCourseToBuild'
import { buildCourse, buildModuleSetting } from '../../test-utils'

import { MODULE_SETTINGS_QUERY } from './hooks/useModuleSettings'
import { SAVE_COURSE_DRAFT } from './hooks/useSaveCourseDraft'
import { SUBMIT_MODULES_MUTATION } from './hooks/useSubmitModules'
import { ICMCourseBuilderV2 } from './ICMCourseBuilderV2'

const user = userEvent.setup()

it('toggles a module selection', async () => {
  const course = buildCourse({
    type: Course_Type_Enum.Closed,
    level: Course_Level_Enum.Level_1,
  })

  const moduleSetting = buildModuleSetting({ mandatory: false })

  const client = {
    executeMutation: () => never,
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
            moduleSettings: [moduleSetting],
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

  const selectedModules = screen.getByTestId('selected-modules')

  const availableModule = screen.getByLabelText(moduleSetting.module.name, {
    exact: false,
  })

  await user.click(availableModule)

  expect(
    within(selectedModules).getByText(moduleSetting.module.name)
  ).toBeInTheDocument()

  await user.click(availableModule)

  expect(
    within(selectedModules).queryByText(moduleSetting.module.name, {
      exact: false,
    })
  ).not.toBeInTheDocument()
})

it('resets the selection to the saved curriculum if a course has one when the clear button is clicked', async () => {
  const moduleSettingOne = buildModuleSetting({ mandatory: false })
  const moduleSettingTwo = buildModuleSetting({ mandatory: false })

  const course = buildCourse({
    type: Course_Type_Enum.Closed,
    level: Course_Level_Enum.Level_1,
    curriculum: [moduleSettingOne.module],
  })

  const client = {
    executeMutation: () => never,
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
            moduleSettings: [moduleSettingOne, moduleSettingTwo],
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

  const selectedModules = screen.getByTestId('selected-modules')

  await user.click(
    screen.getByLabelText(moduleSettingTwo.module.name, { exact: false })
  )

  expect(
    within(selectedModules).getByTestId(
      `selected-module-group-${moduleSettingTwo.module.id}`
    )
  ).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /clear/i }))

  expect(
    within(selectedModules).queryByText(moduleSettingTwo.module.name, {
      exact: false,
    })
  ).not.toBeInTheDocument()
})

it("resets the selection to mandatory modules if a course doesn't have curriculum when the clear button is clicked", async () => {
  const moduleSettingOne = buildModuleSetting({ mandatory: true })
  const moduleSettingTwo = buildModuleSetting({ mandatory: false })

  const course = buildCourse({
    type: Course_Type_Enum.Closed,
    level: Course_Level_Enum.Level_1,
    curriculum: null,
  })

  const client = {
    executeMutation: () => never,
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
            moduleSettings: [moduleSettingOne, moduleSettingTwo],
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

  const selectedModules = screen.getByTestId('selected-modules')

  await user.click(
    screen.getByLabelText(moduleSettingTwo.module.name, { exact: false })
  )

  expect(
    within(selectedModules).getByTestId(
      `selected-module-group-${moduleSettingTwo.module.id}`
    )
  ).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /clear/i }))

  expect(
    within(selectedModules).queryByTestId(
      `selected-module-group-${moduleSettingTwo.module.id}`
    )
  ).not.toBeInTheDocument()

  expect(
    within(selectedModules).getByTestId(
      `selected-module-group-${moduleSettingOne.module.id}`
    )
  ).toBeInTheDocument()
})

it('saves modules and marks a course as draft when a module is selected', async () => {
  const moduleSettingOne = buildModuleSetting({ mandatory: false })
  const moduleSettingTwo = buildModuleSetting({ mandatory: false })

  const course = buildCourse({
    type: Course_Type_Enum.Closed,
    level: Course_Level_Enum.Level_1,
    curriculum: null,
  })

  let draftSaved = false

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: SaveIcmCourseDraftMutationVariables
      query: SaveIcmCourseDraftMutation
    }) => {
      if (query === SAVE_COURSE_DRAFT) {
        const draftMutationMatches = matches({
          variables: { id: course.id, curriculum: [moduleSettingTwo.module] },
        })

        draftSaved = draftMutationMatches({ variables })

        return never
      }
    },
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
            moduleSettings: [moduleSettingOne, moduleSettingTwo],
          },
        })
      }
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

  await user.click(
    screen.getByLabelText(moduleSettingTwo.module.name, { exact: false })
  )

  await waitFor(() => {
    expect(draftSaved).toBe(true)
  })
})

it.each([
  [Course_Level_Enum.Level_1, false],
  [Course_Level_Enum.Level_2, false],
  [Course_Level_Enum.Advanced, false],
  [Course_Level_Enum.AdvancedTrainer, true],
])(
  'displays the time commitment modal if course is %s level and reaccreditation is %b',
  async (level, reaccreditation) => {
    const moduleSettingOne = buildModuleSetting({ mandatory: false })
    const moduleSettingTwo = buildModuleSetting({
      mandatory: false,
      color: Color_Enum.Purple,
    })

    const course = buildCourse({
      type: Course_Type_Enum.Closed,
      level,
      reaccreditation,
      curriculum: null,
    })

    const client = {
      executeMutation: () => never,
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
              moduleSettings: [moduleSettingOne, moduleSettingTwo],
            },
          })
        }
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

    await user.click(
      screen.getByLabelText(moduleSettingTwo.module.name, { exact: false })
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  }
)

it('validates that LEVEL_2 course has at least one purple module selected', async () => {
  const moduleSettingOne = buildModuleSetting({ mandatory: false })
  const moduleSettingTwo = buildModuleSetting({
    mandatory: false,
    color: Color_Enum.Purple,
  })

  const course = buildCourse({
    type: Course_Type_Enum.Closed,
    level: Course_Level_Enum.Level_2,
    reaccreditation: false,
    curriculum: null,
  })

  const client = {
    executeMutation: () => never,
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
            moduleSettings: [moduleSettingOne, moduleSettingTwo],
          },
        })
      }
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

  const submitButton = screen.getByRole('button', { name: /submit/i })

  expect(submitButton).toBeDisabled()

  await user.click(
    screen.getByLabelText(moduleSettingTwo.module.name, { exact: false })
  )

  expect(submitButton).toBeEnabled()
})

it('submits the modules and redirects to the course details page', async () => {
  const course = buildCourse({
    level: Course_Level_Enum.AdvancedTrainer,
    type: Course_Type_Enum.Indirect,
    curriculum: null,
  })
  const moduleSetting = buildModuleSetting({ mandatory: false, duration: 30 })

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
    executeMutation: ({
      query,
      variables,
    }: {
      query: TypedDocumentNode
      variables: SubmitIcmModulesMutationVariables
    }) => {
      const mutationMatches = matches({
        query: SUBMIT_MODULES_MUTATION,
        variables: {
          id: course.id,
          duration: moduleSetting.duration,
          curriculum: [moduleSetting.module],
        },
      })

      if (mutationMatches({ query, variables })) {
        return fromValue<{ data: SubmitIcmModulesMutation }>({
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
          <Route path="modules" element={<ICMCourseBuilderV2 />} />
          <Route path="details" element={<p>Course details</p>} />
        </Route>
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/courses/${course.id}/modules`] }
  )

  const availableModules = screen.getByTestId('available-modules')

  const moduleGroupLabel = within(availableModules).getByLabelText(
    moduleSetting.module.name,
    {
      exact: false,
    }
  )

  await userEvent.click(moduleGroupLabel)
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitFor(() => {
    expect(screen.getByText(/course details/i)).toBeInTheDocument()
  })
})

it('handles the selection of module groups that require others', async () => {
  const dependableModuleSetting = buildModuleSetting()

  const moduleSettingOne = buildModuleSetting({
    dependencies: [{ dependency: dependableModuleSetting }],
  })

  const course = buildCourse({ level: Course_Level_Enum.Level_1 })

  const client = {
    executeQuery: ({ query }: { query: TypedDocumentNode }) => {
      if (query === COURSE_TO_BUILD_QUERY) {
        return fromValue({
          data: {
            course,
          },
        })
      }

      return fromValue<{ data: ModuleSettingsQuery }>({
        data: {
          moduleSettings: [moduleSettingOne, dependableModuleSetting],
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

  const moduleLabel = screen.getByLabelText(moduleSettingOne.module.name, {
    exact: false,
  })

  const dependableModuleLabel = screen.getByLabelText(
    dependableModuleSetting.module.name,
    { exact: true }
  )

  const selectedModules = screen.getByTestId('selected-modules')

  await user.click(moduleLabel)

  expect(dependableModuleLabel).toBeChecked()
  expect(dependableModuleLabel).toBeDisabled()

  expect(
    within(selectedModules).getByTestId(
      `selected-module-group-${dependableModuleSetting.module.id}`
    )
  ).toBeInTheDocument()

  await user.click(moduleLabel)

  expect(dependableModuleLabel).toBeEnabled()
  expect(dependableModuleLabel).toBeChecked()
})
