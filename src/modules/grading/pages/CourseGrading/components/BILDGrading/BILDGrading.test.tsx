import { DocumentNode } from 'graphql'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
  Grade_Enum,
  SaveBildGradeMutation,
  SaveBildGradeMutationVariables,
} from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'
import { buildParticipant } from '@test/mock-data-utils'

import { buildGradingCourse, selectGradingOption } from '../../test-utils'

import { SAVE_BILD_GRADE_MUTATION } from './queries'

import { BILDGrading } from '.'

describe('page: BILDGrading', () => {
  it('displays strategies with module groups and modules', () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const course = buildGradingCourse({
      overrides: {
        bildModules: [
          {
            id: chance.guid(),
            modules: {
              PRIMARY: {
                modules: [{ name: 'Module' }],
              },
            },
          },
        ],
      },
    })

    render(
      <Provider value={client}>
        <BILDGrading course={course} />
      </Provider>,
    )

    expect(screen.getByTestId('strategy-checkbox-PRIMARY')).toBeChecked()
    expect(screen.getByLabelText('Module')).toBeChecked()
  })

  it('saves the grade', async () => {
    const COURSE_ID = 10000
    const participant = buildParticipant()

    const course = buildGradingCourse({
      overrides: {
        id: COURSE_ID,
        level: Course_Level_Enum.BildRegular,
        participants: [participant],
        bildModules: [
          {
            id: chance.guid(),
            modules: {
              PRIMARY: {
                modules: [{ name: 'Module' }],
              },
            },
          },
        ],
      },
    })

    const client = {
      executeMutation: ({
        variables,
        query,
      }: {
        variables: SaveBildGradeMutationVariables
        query: DocumentNode
      }) => {
        if (
          variables.courseId === COURSE_ID &&
          variables.participantIds.includes(participant.id) &&
          variables.grade === Grade_Enum.Pass &&
          query === SAVE_BILD_GRADE_MUTATION
        ) {
          return fromValue<{ data: SaveBildGradeMutation }>({
            data: {
              saveModules: {
                affected_rows: 1,
              },
              saveParticipantsGrade: {
                affectedRows: 1,
              },
              gradingStarted: {
                id: COURSE_ID,
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
          <Route path="/courses/:id">
            <Route path="grading" element={<BILDGrading course={course} />} />
            <Route path="details" element={<h1>Course details</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/${COURSE_ID}/grading`] },
    )

    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    })

    expect(submitButton).toBeDisabled()

    await selectGradingOption('Pass')

    await userEvent.click(submitButton)

    const dialog = screen.getByRole('dialog')

    expect(within(dialog).getByText(/grading confirmation/i)).toBeVisible()

    await userEvent.click(
      within(dialog).getByRole('button', { name: /confirm/i }),
    )

    await waitFor(() => {
      expect(screen.getByText('Course details')).toBeInTheDocument()
    })
  })

  test('displays alert if there is an error when saving grade', async () => {
    const COURSE_ID = 10000

    const course = buildGradingCourse({
      overrides: {
        id: COURSE_ID,
        level: Course_Level_Enum.BildRegular,
        bildModules: [
          {
            id: chance.guid(),
            modules: {
              PRIMARY: {
                modules: [{ name: 'Module' }],
              },
            },
          },
        ],
      },
    })

    const client = {
      executeMutation: () =>
        fromValue({
          error: new CombinedError({
            networkError: Error('Something went wrong!'),
          }),
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/:id">
            <Route path="grading" element={<BILDGrading course={course} />} />
            <Route path="details" element={<h1>Course details</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/${COURSE_ID}/grading`] },
    )

    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    })

    expect(submitButton).toBeDisabled()

    await selectGradingOption('Pass')

    await userEvent.click(submitButton)

    const dialog = screen.getByRole('dialog')

    expect(within(dialog).getByText(/grading confirmation/i)).toBeVisible()

    await userEvent.click(
      within(dialog).getByRole('button', { name: /confirm/i }),
    )

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"There was an error when grading."`,
      )
    })
  })

  it('displays module notes field when grading an individual participant as a TT admin', () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        participants,
        bildModules: [
          {
            id: chance.guid(),
            modules: {
              PRIMARY: {
                modules: [{ name: 'Module' }],
              },
            },
          },
        ],
      },
    })

    render(
      <Provider value={client}>
        <BILDGrading course={course} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      {
        initialEntries: [
          `/${course.id}/grading?participants=${participants[0].id}`,
        ],
      },
    )

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })

  it('displays module notes field when grading an individual participant as a lead trainer', () => {
    const PROFILE_ID = chance.guid()

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        participants,
        trainers: [
          { type: Course_Trainer_Type_Enum.Leader, profile_id: PROFILE_ID },
        ],
        bildModules: [
          {
            id: chance.guid(),
            modules: {
              PRIMARY: {
                modules: [{ name: 'Module' }],
              },
            },
          },
        ],
      },
    })

    render(
      <Provider value={client}>
        <BILDGrading course={course} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          profile: { id: PROFILE_ID },
        },
      },
      {
        initialEntries: [
          `/${course.id}/grading?participants=${participants[0].id}`,
        ],
      },
    )

    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
  })

  it("doesn't display module notes field when grading in bulk", () => {
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        participants,
        bildModules: [
          {
            id: chance.guid(),
            modules: {
              PRIMARY: {
                modules: [{ name: 'Module' }],
              },
            },
          },
        ],
      },
    })

    render(
      <Provider value={client}>
        <BILDGrading course={course} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/${course.id}/grading`] },
    )

    expect(screen.queryByLabelText(/notes/i)).not.toBeInTheDocument()
  })

  it("doesn't display module notes field when grading as an assistant trainer", () => {
    const PROFILE_ID = chance.guid()

    const client = {
      executeMutation: () => never,
    } as unknown as Client

    const participants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        participants,
        trainers: [
          { type: Course_Trainer_Type_Enum.Assistant, profile_id: PROFILE_ID },
        ],
        bildModules: [
          {
            id: chance.guid(),
            modules: {
              PRIMARY: {
                modules: [{ name: 'Module' }],
              },
            },
          },
        ],
      },
    })

    render(
      <Provider value={client}>
        <BILDGrading course={course} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          profile: { id: PROFILE_ID },
        },
      },
      {
        initialEntries: [
          `/${course.id}/grading?participants=${participants[0].id}`,
        ],
      },
    )

    expect(screen.queryByLabelText(/notes/i)).not.toBeInTheDocument()
  })
})
