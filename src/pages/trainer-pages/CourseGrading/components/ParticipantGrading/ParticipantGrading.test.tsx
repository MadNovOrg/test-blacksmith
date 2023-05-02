import React from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { CourseParticipantQuery, Grade_Enum } from '@app/generated/graphql'

import { render, screen, within, userEvent, waitFor } from '@test/index'
import {
  buildModule,
  buildModuleGroup,
  buildParticipant,
  buildParticipantModule,
} from '@test/mock-data-utils'

import { ParticipantGrading } from '.'

const MockCourseDetails = () => {
  const [searchParams] = useSearchParams()

  return <p>{searchParams.get('tab')}</p>
}

describe('page: ParticipantGrading', () => {
  it("displays participant's name and final grade", () => {
    const participant = buildParticipant({
      overrides: {
        grade: Grade_Enum.Pass,
      },
    }) as unknown as NonNullable<CourseParticipantQuery['participant']>

    const client = {
      executeQuery: () =>
        fromValue<{ data: CourseParticipantQuery }>({
          data: {
            participant,
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ParticipantGrading />
      </Provider>,
      {},
      { initialEntries: [`/courses/course-id/grading/${participant.id}`] }
    )

    expect(
      screen.getByText(participant.profile.fullName ?? '')
    ).toBeInTheDocument()
    expect(screen.getByText('Pass')).toBeInTheDocument()
  })

  it('displays completed modules and incomplete modules within the module group', () => {
    const firstModuleGroup = buildModuleGroup()
    const secondModuleGroup = buildModuleGroup()

    const gradingModules = [
      {
        ...buildParticipantModule(),
        completed: false,
        module: {
          ...buildModule(),
          moduleGroup: firstModuleGroup,
        },
      },
      {
        ...buildParticipantModule(),
        completed: true,
        module: {
          ...buildModule(),
          moduleGroup: firstModuleGroup,
        },
      },
      {
        ...buildParticipantModule(),
        completed: true,
        module: {
          ...buildModule(),
          moduleGroup: secondModuleGroup,
        },
      },
    ]

    const participant = buildParticipant({
      overrides: {
        grade: Grade_Enum.Pass,
        gradingModules,
      },
    }) as unknown as NonNullable<CourseParticipantQuery['participant']>

    const client = {
      executeQuery: () =>
        fromValue<{ data: CourseParticipantQuery }>({
          data: {
            participant,
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ParticipantGrading />
      </Provider>,
      {},
      { initialEntries: [`/courses/course-id/grading/${participant.id}`] }
    )

    const firstModuleGroupElem = screen.getByTestId(
      `graded-module-group-${firstModuleGroup.id}`
    )

    const secondModuleGroupElem = screen.getByTestId(
      `graded-module-group-${secondModuleGroup.id}`
    )

    expect(
      within(firstModuleGroupElem).getByText(gradingModules[1].module.name)
    ).toBeInTheDocument()

    expect(
      within(firstModuleGroupElem).getByText('1 of 2 completed')
    ).toBeInTheDocument()

    const incompleteModulesElem =
      within(firstModuleGroupElem).getByTestId('incomplete-modules')

    expect(
      within(incompleteModulesElem).getByText(gradingModules[0].module.name)
    ).toBeInTheDocument()

    expect(
      within(secondModuleGroupElem).queryByText('Incomplete')
    ).not.toBeInTheDocument()

    expect(
      within(secondModuleGroupElem).getByText('1 of 1 completed')
    ).toBeInTheDocument()
  })

  it('navigates back to the course details page with grading query param', async () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: CourseParticipantQuery }>({
          data: {
            participant: buildParticipant() as unknown as NonNullable<
              CourseParticipantQuery['participant']
            >,
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            element={<ParticipantGrading />}
            path="/courses/:id/grading/:participant-id"
          />
          <Route
            element={<MockCourseDetails />}
            path={'/courses/:id/details'}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/course-id/grading/participant-id`] }
    )

    await userEvent.click(screen.getByText('Back to course details'))

    await waitFor(() => {
      expect(screen.getByText('GRADING')).toBeInTheDocument()
    })
  })
})
