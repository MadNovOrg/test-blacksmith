import { matches } from 'lodash'
import { Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Accreditors_Enum,
  CourseCurriculumQuery,
  CourseCurriculumQueryVariables,
  SaveCurriculumSelectionMutation,
  SaveCurriculumSelectionMutationVariables,
} from '@app/generated/graphql'
import { buildLesson, buildModule } from '@app/modules/grading/utils'

import { render, screen, userEvent } from '@test/index'

import { GradingDetailsProvider } from '../../components/GradingDetailsProvider'

import { COURSE_CURRICULUM } from './hooks/useCourseCurriculum'
import { SAVE_CURRICULUM_SELECTION } from './hooks/useSaveCurriculumSelection'
import { ModulesSelectionV2 } from './ModulesSelectionV2'

const user = userEvent.setup()

it('shows a spinner while loading course', () => {
  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CourseCurriculumQueryVariables
      query: TypedDocumentNode
    }) => {
      if (query === COURSE_CURRICULUM && variables.id === 1) {
        return never
      }

      return fromValue({})
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/courses/:id/grading/details/modules"
            element={<ModulesSelectionV2 />}
          />
        </Routes>
      </GradingDetailsProvider>
    </Provider>,
    {},
    { initialEntries: [`/courses/1/grading/details/modules`] },
  )

  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

it('stores curriculum selection to local storage when selection changes', async () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: { items: [buildLesson()] },
  })

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CourseCurriculumQueryVariables
      query: TypedDocumentNode
    }) => {
      if (query === COURSE_CURRICULUM && variables.id === 1) {
        return fromValue<{ data: CourseCurriculumQuery }>({
          data: {
            course: {
              id: 1,
              curriculum: [module],
            },
          },
        })
      }

      return never
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/courses/:id/grading/details/modules"
            element={<ModulesSelectionV2 />}
          />
        </Routes>
      </GradingDetailsProvider>
    </Provider>,
    {},
    { initialEntries: [`/courses/1/grading/details/modules`] },
  )

  await user.click(screen.getByLabelText(module.lessons.items[0].name))

  const storedSelection = localStorage.getItem('modules-selection-v2-1')

  expect(storedSelection).toEqual(
    JSON.stringify([
      {
        ...module,
        lessons: {
          items: module.lessons.items.map((l: { name: string }) => ({
            ...l,
            covered: false,
          })),
        },
      },
    ]),
  )
})

it('displays selection from the local storage if previous selection was saved', async () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: { items: [buildLesson()] },
  })

  localStorage.setItem(
    `modules-selection-v2-1`,
    JSON.stringify([
      {
        ...module,
        lessons: {
          items: module.lessons.items.map((l: { name: string }) => ({
            ...l,
            covered: true,
          })),
        },
      },
    ]),
  )

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CourseCurriculumQueryVariables
      query: TypedDocumentNode
    }) => {
      if (query === COURSE_CURRICULUM && variables.id === 1) {
        return fromValue<{ data: CourseCurriculumQuery }>({
          data: {
            course: {
              id: 1,
              curriculum: [module],
            },
          },
        })
      }

      return never
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/courses/:id/grading/details/modules"
            element={<ModulesSelectionV2 />}
          />
        </Routes>
      </GradingDetailsProvider>
    </Provider>,
    {},
    { initialEntries: [`/courses/1/grading/details/modules`] },
  )

  expect(screen.getByLabelText(module.lessons.items[0].name)).toBeChecked()
})

it('navigates to the grading clearance step when clicked on the back button', async () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: { items: [buildLesson()] },
  })

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CourseCurriculumQueryVariables
      query: TypedDocumentNode
    }) => {
      if (query === COURSE_CURRICULUM && variables.id === 1) {
        return fromValue<{ data: CourseCurriculumQuery }>({
          data: {
            course: {
              id: 1,
              curriculum: [module],
            },
          },
        })
      }

      return never
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route path="/courses/:id/grading/details">
            <Route path="modules" element={<ModulesSelectionV2 />} />
            <Route index element={<p>grading clearance page</p>} />
          </Route>
        </Routes>
      </GradingDetailsProvider>
    </Provider>,
    {},
    { initialEntries: [`/courses/1/grading/details/modules`] },
  )

  await user.click(
    screen.getByRole('button', { name: /back to grading clearance/i }),
  )

  expect(screen.getByText(/grading clearance page/i)).toBeInTheDocument()
})

it('saves modules selection when clicked on the submit button', async () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: { items: [buildLesson()] },
  })

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CourseCurriculumQueryVariables
      query: TypedDocumentNode
    }) => {
      if (query === COURSE_CURRICULUM && variables.id === 1) {
        return fromValue<{ data: CourseCurriculumQuery }>({
          data: {
            course: {
              id: 1,
              curriculum: [module],
            },
          },
        })
      }

      return never
    },
    executeMutation: ({
      query,
      variables,
    }: {
      query: TypedDocumentNode
      variables: SaveCurriculumSelectionMutationVariables
    }) => {
      const mutationMatches = matches({
        query: SAVE_CURRICULUM_SELECTION,
        variables: {
          courseId: 1,
          curriculum: [
            {
              ...module,
              lessons: {
                items: module.lessons.items.map((l: { name: string }) => ({
                  ...l,
                  covered: true,
                })),
              },
            },
          ],
        },
      })

      if (mutationMatches({ query, variables })) {
        return fromValue<{ data: SaveCurriculumSelectionMutation }>({
          data: {
            update_course_by_pk: {
              id: 1,
            },
          },
        })
      }
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route path="/courses/:id">
            <Route path="details" element={<p>course details page</p>} />
            <Route path="grading/details">
              <Route path="modules" element={<ModulesSelectionV2 />} />
              <Route index element={<p>grading clearance page</p>} />
            </Route>
          </Route>
        </Routes>
      </GradingDetailsProvider>
    </Provider>,
    {},
    { initialEntries: [`/courses/1/grading/details/modules`] },
  )

  await user.click(
    screen.getByRole('button', { name: /continue to grading attendees/i }),
  )

  expect(screen.getByText(/course details page/i)).toBeInTheDocument()
  expect(localStorage.getItem(`modules-selection-v2-1`)).toBeNull()
})

it('displays an alert if there is an error saving the selection', async () => {
  const module = buildModule({
    name: 'Theory',
    mandatory: false,
    lessons: { items: [buildLesson()] },
  })

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CourseCurriculumQueryVariables
      query: TypedDocumentNode
    }) => {
      if (query === COURSE_CURRICULUM && variables.id === 1) {
        return fromValue<{ data: CourseCurriculumQuery }>({
          data: {
            course: {
              id: 1,
              curriculum: [module],
            },
          },
        })
      }

      return never
    },
    executeMutation: () => {
      return fromValue({
        error: new CombinedError({
          networkError: Error('something went wrong!'),
        }),
      })
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route path="/courses/:id">
            <Route path="details" element={<p>course details page</p>} />
            <Route path="grading/details">
              <Route path="modules" element={<ModulesSelectionV2 />} />
              <Route index element={<p>grading clearance page</p>} />
            </Route>
          </Route>
        </Routes>
      </GradingDetailsProvider>
    </Provider>,
    {},
    { initialEntries: [`/courses/1/grading/details/modules`] },
  )

  await user.click(screen.getByLabelText(module.lessons.items[0].name))

  await user.click(
    screen.getByRole('button', { name: /continue to grading attendees/i }),
  )

  expect(screen.getByTestId('saving-alert')).toBeInTheDocument()
})

it('pre-selects all of the modules when starting grading', () => {
  const modules = [
    buildModule({
      name: 'Theory',
      mandatory: false,
      lessons: { items: [buildLesson()] },
    }),
    buildModule({
      name: 'Practical',
      mandatory: true,
      lessons: { items: [buildLesson()] },
    }),
  ]

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CourseCurriculumQueryVariables
      query: TypedDocumentNode
    }) => {
      if (query === COURSE_CURRICULUM && variables.id === 1) {
        return fromValue<{ data: CourseCurriculumQuery }>({
          data: {
            course: {
              id: 1,
              curriculum: modules,
            },
          },
        })
      }

      return never
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <GradingDetailsProvider accreditedBy={Accreditors_Enum.Icm}>
        <Routes>
          <Route
            path="/courses/:id/grading/details/modules"
            element={<ModulesSelectionV2 />}
          />
        </Routes>
      </GradingDetailsProvider>
    </Provider>,
    {},
    { initialEntries: [`/courses/1/grading/details/modules`] },
  )

  const checkboxes = screen.getAllByRole('checkbox')

  expect(checkboxes).toHaveLength(2)
  for (const checkbox of checkboxes) {
    expect(checkbox).toBeChecked()
  }

  expect(screen.getByText(/theory/i)).toBeInTheDocument()
  expect(screen.getByText(/practical/i)).toBeInTheDocument()
})
