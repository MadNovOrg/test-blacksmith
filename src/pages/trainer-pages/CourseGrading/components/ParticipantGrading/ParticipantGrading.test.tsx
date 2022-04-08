import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import useCourseParticipant from '@app/hooks/useCourseParticipant'
import { Grade } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, within } from '@test/index'
import {
  buildModule,
  buildModuleGroup,
  buildParticipant,
  buildParticipantModule,
} from '@test/mock-data-utils'

import { ParticipantGrading } from '.'

jest.mock('@app/hooks/useCourseParticipant')

const useCourseParticipantMocked = jest.mocked(useCourseParticipant)

describe('page: ParticipantGrading', () => {
  it("displays participant's name and final grade", () => {
    const participant = buildParticipant({
      overrides: {
        grade: Grade.PASS,
      },
    })

    useCourseParticipantMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participant,
    })

    render(
      <MemoryRouter
        initialEntries={[`/courses/course-id/grading/${participant.id}`]}
      >
        <ParticipantGrading />
      </MemoryRouter>
    )

    expect(screen.getByText(participant.profile.fullName)).toBeInTheDocument()
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
        grade: Grade.PASS,
        gradingModules,
      },
    })

    useCourseParticipantMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participant,
    })

    render(
      <MemoryRouter
        initialEntries={[`/courses/course-id/grading/${participant.id}`]}
      >
        <ParticipantGrading />
      </MemoryRouter>
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

    expect(within(secondModuleGroupElem).getByText('1 of 1 completed'))
  })
})
