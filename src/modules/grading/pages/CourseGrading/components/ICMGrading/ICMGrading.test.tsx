import { TypedQueryDocumentNode } from 'graphql'
import { matches } from 'lodash'
import { Routes, Route } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Trainer_Type_Enum,
  Grade_Enum,
  SaveCourseGradingMutation,
  SaveGradingDetailsMutationVariables,
} from '@app/generated/graphql'
import { Grade, RoleName } from '@app/types'

import { render, screen, within, userEvent, chance } from '@test/index'
import { buildCourseModule, buildParticipant } from '@test/mock-data-utils'

import { SAVE_COURSE_GRADING_MUTATION } from '../../queries/save-course-grading'
import { buildGradingCourse, selectGradingOption } from '../../test-utils'

import { ICMGrading } from './ICMGrading'

describe('page: CourseGrading', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays course name, course participants who attended and covered course modules', () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/:id/grading" element={<ICMGrading course={course} />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()

    const coveredModuleGroup = screen.getByTestId(
      `module-group-${courseModules[0].module.moduleGroup.id}`
    )

    expect(
      within(coveredModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeChecked()

    expect(
      screen.queryByTestId(
        `module-group-${courseModules[1].module.moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    const attendedParticipant = courseParticipants[1]
    const notAttendedParticipant = courseParticipants[0]

    expect(
      screen.getByText(`${attendedParticipant.profile.fullName}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(`${notAttendedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('All attendees')).toBeInTheDocument()
  })

  it("doesn't display already graded participants", () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: true, grade: Grade_Enum.Pass },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/:id/grading" element={<ICMGrading course={course} />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()

    const coveredModuleGroup = screen.getByTestId(
      `module-group-${courseModules[0].module.moduleGroup.id}`
    )

    expect(
      within(coveredModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeChecked()

    expect(
      screen.queryByTestId(
        `module-group-${courseModules[1].module.moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    const attendedParticipant = courseParticipants[1]
    const notAttendedParticipant = courseParticipants[0]

    expect(
      screen.getByText(`${attendedParticipant.profile.fullName}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(`${notAttendedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('All attendees')).toBeInTheDocument()
  })

  it('displays selected participants from query param', () => {
    const COURSE_ID = 'course-id'
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/:id/grading" element={<ICMGrading course={course} />} />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/${COURSE_ID}/grading?participants=${courseParticipants[0].id},${courseParticipants[1].id}`,
        ],
      }
    )

    const selectedParticipants = [courseParticipants[0], courseParticipants[1]]
    const notSelectedParticipant = courseParticipants[2]

    selectedParticipants.forEach(participant => {
      expect(
        screen.getByText(`${participant.profile.fullName}`)
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByText(`${notSelectedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('2 attendee(s)')).toBeInTheDocument()
  })

  it('displays confirmation modal when clicked on submit button', async () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/:id/grading" element={<ICMGrading course={course} />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await selectGradingOption('Pass')

    await userEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Grading confirmation')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByText('Confirm')).toBeVisible()
  })

  it('closes modal when saving is not confirmed', async () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/:id/grading" element={<ICMGrading course={course} />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await selectGradingOption('Pass')

    await userEvent.click(screen.getByText('Submit'))

    await userEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByText('Grading confirmation')).not.toBeVisible()
  })

  it("disables save button if a grading option isn't selected", () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    expect(screen.getByText('Submit')).toBeDisabled()
  })

  it('saves grades for participants when an intent for saving is confirmed', async () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: ({
        variables,
        query,
      }: {
        variables: SaveGradingDetailsMutationVariables
        query: TypedQueryDocumentNode
      }) => {
        const mutationMatches = matches({
          query: SAVE_COURSE_GRADING_MUTATION,
          variables: {
            modules: [
              {
                course_participant_id: courseParticipants[1].id,
                module_id: courseModules[0].module.id,
                completed: false,
              },
              {
                course_participant_id: courseParticipants[1].id,
                module_id: courseModules[1].module.id,
                completed: true,
              },
            ],
            participantIds: [courseParticipants[1].id],
            grade: Grade.OBSERVE_ONLY,
            courseId: course.id,
            notes: [],
          },
        })

        if (mutationMatches({ query, variables })) {
          return fromValue<SaveCourseGradingMutation>({
            saveModules: {
              affectedRows: 2,
            },
            saveParticipantsGrade: {
              affectedRows: 2,
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
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await userEvent.click(screen.getByLabelText(courseModules[0].module.name))

    await selectGradingOption('Non-Physical Pass')

    await userEvent.click(screen.getByText('Submit'))
    await userEvent.click(screen.getByText('Confirm'))

    expect(screen.getByText(/course details/i)).toBeInTheDocument()
  })

  it('displays loading state while saving grades', async () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await userEvent.click(screen.getByLabelText(courseModules[0].module.name))

    await selectGradingOption('Non-Physical Pass')

    await userEvent.click(screen.getByText('Submit'))
    await userEvent.click(screen.getByText('Confirm'))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays an alert if there was an error saving grades', async () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
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
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await userEvent.click(screen.getByLabelText(courseModules[0].module.name))

    await selectGradingOption('Non-Physical Pass')

    await userEvent.click(screen.getByText('Submit'))
    await userEvent.click(screen.getByText('Confirm'))

    expect(
      screen.getByTestId('saving-grading-error-alert').textContent
    ).toMatchInlineSnapshot('"There was an error when grading."')
  })

  it('displays module notes field when grading an individual participant as an admin', () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]

    const participant = { ...buildParticipant(), attended: true }

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: [participant],
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      {
        initialEntries: [
          `/${COURSE_ID}/grading?participants=${participant.id}`,
        ],
      }
    )

    expect(screen.getAllByLabelText(/notes/i)).toBeTruthy()
  })

  it('displays module notes field when grading an individual participant as a lead trainer', () => {
    const COURSE_ID = 'course-id'
    const PROFILE_ID = chance.guid()

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]

    const participant = { ...buildParticipant(), attended: true }

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
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
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER, profile: { id: PROFILE_ID } } },
      {
        initialEntries: [
          `/${COURSE_ID}/grading?participants=${participant.id}`,
        ],
      }
    )

    expect(screen.getAllByLabelText(/notes/i)).toBeTruthy()
  })

  it("doesn't display module notes field when grading in bulk", () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]

    const participants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants,
      },
    })

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [`/${COURSE_ID}/grading`],
      }
    )

    expect(screen.queryAllByLabelText(/notes/i)).toHaveLength(0)
  })

  it("doesn't display module notes field when grading as an assistant trainer", () => {
    const COURSE_ID = 'course-id'
    const PROFILE_ID = chance.guid()

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]

    const participant = { ...buildParticipant(), attended: true }

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
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
          <Route path=":id/grading" element={<ICMGrading course={course} />} />
          <Route
            path="/courses/:id/details"
            element={<h1>Course details</h1>}
          />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER, profile: { id: PROFILE_ID } } },
      {
        initialEntries: [
          `/${COURSE_ID}/grading?participants=${participant.id}`,
        ],
      }
    )

    expect(screen.queryAllByLabelText(/notes/i)).toHaveLength(0)
  })
})
