import { TypedQueryDocumentNode } from 'graphql'
import { matches } from 'lodash'
import { Routes, Route } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Trainer_Type_Enum,
  Grade_Enum,
  SaveCourseGradingV2Mutation,
  SaveCourseGradingV2MutationVariables,
} from '@app/generated/graphql'
import { buildLesson, buildModule } from '@app/modules/grading/test-utils'
import { Grade, RoleName } from '@app/types'

import { render, screen, within, userEvent, chance } from '@test/index'
import { buildParticipant } from '@test/mock-data-utils'

import { buildGradingCourse, selectGradingOption } from '../../test-utils'

import { SAVE_COURSE_GRADING } from './hooks/useSaveCourseGrading'
import { ICMGradingV2 } from './ICMGradingV2'

const user = userEvent.setup()

it('displays course name, course participants who attended and covered course modules', () => {
  const COURSE_ID = 'course-id'

  const coveredLesson = buildLesson({ covered: true })
  const notCoveredLesson = buildLesson({ covered: false })

  const curriculum = [
    buildModule({
      name: 'Theory',
      lessons: {
        items: [coveredLesson, notCoveredLesson],
      },
    }),
  ]

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum,
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path="/:id/grading" element={<ICMGradingV2 course={course} />} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  expect(screen.getByText(course.name)).toBeInTheDocument()

  const moduleAccordion = within(
    screen.getByTestId(`module-group-${curriculum[0].id}`),
  ).getByTestId('accordion-summary')

  expect(
    within(moduleAccordion).getByLabelText(curriculum[0].name),
  ).toBeChecked()

  expect(screen.getByLabelText(coveredLesson.name)).toBeChecked()
  expect(screen.queryByLabelText(notCoveredLesson.name)).not.toBeInTheDocument()

  const attendedParticipant = courseParticipants[1]
  const notAttendedParticipant = courseParticipants[0]

  expect(
    screen.getByText(`${attendedParticipant.profile.fullName}`),
  ).toBeInTheDocument()

  expect(
    screen.queryByText(`${notAttendedParticipant.profile.fullName}`),
  ).not.toBeInTheDocument()

  expect(screen.getByText('All attendees')).toBeInTheDocument()
})

it("doesn't display already graded participants", () => {
  const COURSE_ID = 'course-id'

  const courseParticipants = [
    { ...buildParticipant(), attended: true, grade: Grade_Enum.Pass },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path="/:id/grading" element={<ICMGradingV2 course={course} />} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  const attendedParticipant = courseParticipants[1]
  const notAttendedParticipant = courseParticipants[0]

  expect(
    screen.getByText(`${attendedParticipant.profile.fullName}`),
  ).toBeInTheDocument()

  expect(
    screen.queryByText(`${notAttendedParticipant.profile.fullName}`),
  ).not.toBeInTheDocument()

  expect(screen.getByText('All attendees')).toBeInTheDocument()
})

it('displays selected participants from query param', () => {
  const COURSE_ID = 'course-id'

  const courseParticipants = [
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path="/:id/grading" element={<ICMGradingV2 course={course} />} />
      </Routes>
    </Provider>,
    {},
    {
      initialEntries: [
        `/${COURSE_ID}/grading?participants=${courseParticipants[0].id},${courseParticipants[1].id}`,
      ],
    },
  )

  const selectedParticipants = [courseParticipants[0], courseParticipants[1]]
  const notSelectedParticipant = courseParticipants[2]

  selectedParticipants.forEach(participant => {
    expect(
      screen.getByText(`${participant.profile.fullName}`),
    ).toBeInTheDocument()
  })

  expect(
    screen.queryByText(`${notSelectedParticipant.profile.fullName}`),
  ).not.toBeInTheDocument()

  expect(screen.getByText('2 attendee(s)')).toBeInTheDocument()
})

it('displays confirmation modal when clicked on submit button', async () => {
  const COURSE_ID = 'course-id'

  const moduleToSelect = buildModule({
    name: 'Theory',
    lessons: {
      items: [buildLesson({ covered: true }), buildLesson({ covered: true })],
    },
  })

  const moduleToDeselect = buildModule({
    name: 'To deselect',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [moduleToSelect, moduleToDeselect],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path="/:id/grading" element={<ICMGradingV2 course={course} />} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  await selectGradingOption('Pass')

  await user.click(screen.getByText('Submit'))

  const dialog = screen.getByRole('dialog')

  expect(within(dialog).getByText(/grading confirmation/i)).toBeInTheDocument()

  expect(
    within(dialog).getByRole('button', { name: /cancel/i }),
  ).toBeInTheDocument()

  expect(screen.getByText('Confirm')).toBeInTheDocument()
})

it('closes modal when saving is not confirmed', async () => {
  const COURSE_ID = 'course-id'

  const moduleToSelect = buildModule({
    name: 'Theory',
    lessons: {
      items: [buildLesson({ covered: true }), buildLesson({ covered: true })],
    },
  })

  const moduleToDeselect = buildModule({
    name: 'To deselect',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [moduleToSelect, moduleToDeselect],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path="/:id/grading" element={<ICMGradingV2 course={course} />} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  await selectGradingOption('Pass')

  await user.click(screen.getByRole('button', { name: /submit/i }))

  const dialog = screen.getByRole('dialog')

  await user.click(within(dialog).getByRole('button', { name: /cancel/i }))

  expect(
    within(dialog).queryByRole('button', { name: /grading confirmation/i }),
  ).not.toBeInTheDocument()
})

it("disables save button if a grading option isn't selected", () => {
  const COURSE_ID = 'course-id'

  const moduleToSelect = buildModule({
    name: 'Theory',
    lessons: {
      items: [buildLesson({ covered: true }), buildLesson({ covered: true })],
    },
  })

  const moduleToDeselect = buildModule({
    name: 'To deselect',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [moduleToSelect, moduleToDeselect],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
})

it('saves grades for participants when an intent for saving is confirmed', async () => {
  const COURSE_ID = 'course-id'

  const moduleToSelect = buildModule({
    name: 'Theory',
    lessons: {
      items: [buildLesson({ covered: true }), buildLesson({ covered: true })],
    },
  })

  const moduleToDeselect = buildModule({
    name: 'To deselect',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [moduleToSelect, moduleToDeselect],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: ({
      variables,
      query,
    }: {
      variables: SaveCourseGradingV2MutationVariables
      query: TypedQueryDocumentNode
    }) => {
      const mutationMatches = matches({
        query: SAVE_COURSE_GRADING,
        variables: {
          participantIds: [courseParticipants[1].id],
          grade: Grade.OBSERVE_ONLY,
          courseId: course.id,
          gradedOn: [{ ...moduleToSelect, note: 'Note for a module' }],
        },
      })

      if (mutationMatches({ query, variables })) {
        return fromValue<{ data: SaveCourseGradingV2Mutation }>({
          data: {
            saveParticipantsGrade: {
              affectedRows: 2,
            },
          },
        })
      }

      return fromValue<{ error: CombinedError }>({
        error: new CombinedError({
          networkError: Error('something went wrong!'),
        }),
      })
    },
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route
          path="/courses/:id/details"
          element={<h1>Course details page</h1>}
        />
      </Routes>
    </Provider>,
    { auth: { activeRole: RoleName.TT_ADMIN } },
    {
      initialEntries: [
        `/${COURSE_ID}/grading?participants=${courseParticipants[1].id}`,
      ],
    },
  )

  await user.type(screen.getAllByLabelText(/notes/i)[0], 'Note for a module')

  const moduleToDeselectAccordion = within(
    screen.getByTestId(`module-group-${moduleToDeselect.id}`),
  ).getByTestId('accordion-summary')

  await user.click(
    within(moduleToDeselectAccordion).getByLabelText(moduleToDeselect.name),
  )

  await selectGradingOption('Non-Physical Pass')

  await user.click(screen.getByRole('button', { name: /submit/i }))
  await user.click(screen.getByRole('button', { name: /confirm/i }))

  expect(screen.getByText(/course details page/i)).toBeInTheDocument()
})

it('displays loading state while saving grades', async () => {
  const COURSE_ID = 'course-id'

  const moduleToSelect = buildModule({
    name: 'Theory',
    lessons: {
      items: [buildLesson({ covered: true }), buildLesson({ covered: true })],
    },
  })

  const moduleToDeselect = buildModule({
    name: 'To deselect',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [moduleToSelect, moduleToDeselect],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  await selectGradingOption('Non-Physical Pass')

  await user.click(screen.getByRole('button', { name: /submit/i }))
  await user.click(screen.getByRole('button', { name: /confirm/i }))

  expect(screen.getByRole('progressbar')).toBeInTheDocument()
})

it('displays an alert if there was an error saving grades', async () => {
  const COURSE_ID = 'course-id'

  const moduleToSelect = buildModule({
    name: 'Theory',
    lessons: {
      items: [buildLesson({ covered: true }), buildLesson({ covered: true })],
    },
  })

  const moduleToDeselect = buildModule({
    name: 'To deselect',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [moduleToSelect, moduleToDeselect],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () =>
      fromValue<{ error: CombinedError }>({
        error: new CombinedError({
          networkError: Error('Something went wrong'),
        }),
      }),
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  await selectGradingOption('Non-Physical Pass')

  await user.click(screen.getByRole('button', { name: /submit/i }))
  await user.click(screen.getByRole('button', { name: /confirm/i }))

  expect(
    screen.getByTestId('saving-grading-error-alert').textContent,
  ).toMatchInlineSnapshot('"There was an error when grading."')
})

it('displays module notes field when grading an individual participant as an admin', () => {
  const COURSE_ID = 'course-id'

  const module = buildModule({
    name: 'Theory',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const participant = { ...buildParticipant(), attended: true }

  const course = buildGradingCourse({
    overrides: {
      curriculum: [module],
      participants: [participant],
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    { auth: { activeRole: RoleName.TT_ADMIN } },
    {
      initialEntries: [`/${COURSE_ID}/grading?participants=${participant.id}`],
    },
  )

  expect(screen.getAllByLabelText(/notes/i)).toBeTruthy()
})

it('displays module notes field when grading an individual participant as a lead trainer', () => {
  const COURSE_ID = 'course-id'
  const PROFILE_ID = chance.guid()

  const module = buildModule({
    name: 'Theory',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const participant = { ...buildParticipant(), attended: true }

  const course = buildGradingCourse({
    overrides: {
      curriculum: [module],
      participants: [participant],
      trainers: [
        { type: Course_Trainer_Type_Enum.Leader, profile_id: PROFILE_ID },
      ],
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    { auth: { activeRole: RoleName.TRAINER, profile: { id: PROFILE_ID } } },
    {
      initialEntries: [`/${COURSE_ID}/grading?participants=${participant.id}`],
    },
  )

  expect(screen.getAllByLabelText(/notes/i)).toBeTruthy()
})

it("doesn't display module notes field when grading in bulk", () => {
  const COURSE_ID = 'course-id'

  const moduleToSelect = buildModule({
    name: 'Theory',
    lessons: {
      items: [buildLesson({ covered: true }), buildLesson({ covered: true })],
    },
  })

  const moduleToDeselect = buildModule({
    name: 'To deselect',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const courseParticipants = [
    { ...buildParticipant(), attended: false },
    { ...buildParticipant(), attended: true },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [moduleToSelect, moduleToDeselect],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    {},
    {
      initialEntries: [`/${COURSE_ID}/grading`],
    },
  )

  expect(screen.queryAllByLabelText(/notes/i)).toHaveLength(0)
})

it("doesn't display module notes field when grading as an assistant trainer", () => {
  const COURSE_ID = 'course-id'
  const PROFILE_ID = chance.guid()

  const module = buildModule()

  const participant = { ...buildParticipant(), attended: true }

  const course = buildGradingCourse({
    overrides: {
      curriculum: [module],
      participants: [participant],
      trainers: [
        { type: Course_Trainer_Type_Enum.Leader, profile_id: chance.guid() },
        { type: Course_Trainer_Type_Enum.Assistant, profile_id: PROFILE_ID },
      ],
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    { auth: { activeRole: RoleName.TRAINER, profile: { id: PROFILE_ID } } },
    {
      initialEntries: [`/${COURSE_ID}/grading?participants=${participant.id}`],
    },
  )

  expect(screen.queryAllByLabelText(/notes/i)).toHaveLength(0)
})

it("doesn't display modules that don't have any covered lessons", () => {
  const COURSE_ID = 'course-id'
  const PROFILE_ID = chance.guid()

  const notCoveredModule = buildModule({
    name: 'Not covered module',
    lessons: { items: [buildLesson({ covered: false })] },
  })

  const coveredModule = buildModule({
    name: 'Covered module',
    lessons: { items: [buildLesson({ covered: true })] },
  })

  const participant = { ...buildParticipant(), attended: true }

  const course = buildGradingCourse({
    overrides: {
      curriculum: [coveredModule, notCoveredModule],
      participants: [participant],
      trainers: [
        { type: Course_Trainer_Type_Enum.Leader, profile_id: chance.guid() },
        { type: Course_Trainer_Type_Enum.Assistant, profile_id: PROFILE_ID },
      ],
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path=":id/grading" element={<ICMGradingV2 course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>
    </Provider>,
    { auth: { activeRole: RoleName.TRAINER, profile: { id: PROFILE_ID } } },
    {
      initialEntries: [`/${COURSE_ID}/grading?participants=${participant.id}`],
    },
  )

  expect(screen.queryByLabelText(notCoveredModule.name)).not.toBeInTheDocument()

  const moduleAccordion = within(
    screen.getByTestId(`module-group-${coveredModule.id}`),
  ).getByTestId('accordion-summary')

  expect(
    within(moduleAccordion).getByLabelText(coveredModule.name),
  ).toBeChecked()
})

it("displays proper message when course doesn't have modules", () => {
  const COURSE_ID = 'course-id'

  const courseParticipants = [
    { ...buildParticipant(), attended: true, grade: Grade_Enum.Pass },
    { ...buildParticipant(), attended: true },
  ]

  const course = buildGradingCourse({
    overrides: {
      curriculum: [],
      participants: courseParticipants,
    },
  })

  const client = {
    executeMutation: () => never,
  } as unknown as Client

  render(
    <Provider value={client}>
      <Routes>
        <Route path="/:id/grading" element={<ICMGradingV2 course={course} />} />
      </Routes>
    </Provider>,
    {},
    { initialEntries: [`/${COURSE_ID}/grading`] },
  )

  expect(
    screen.getByText(`There are no modules for this course.`),
  ).toBeInTheDocument()
})
