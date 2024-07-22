import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GradedParticipantQuery, Grade_Enum } from '@app/generated/graphql'

import { render, screen, within, userEvent, waitFor } from '@test/index'
import { buildParticipant } from '@test/mock-data-utils'

import { buildLesson, buildModule as buildModuleV2 } from '../../utils'

import { ParticipantGrade } from './ParticipantGrade'
import { buildGradedParticipant } from './test-utils'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))

const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

const MockCourseDetails = () => {
  const [searchParams] = useSearchParams()

  return <p>{searchParams.get('tab')}</p>
}

describe('page: ParticipantGrade', () => {
  it("displays participant's name and final grade", () => {
    useFeatureFlagEnabledMock.mockReturnValue(false)

    const participant = buildParticipant({
      overrides: {
        grade: Grade_Enum.Pass,
      },
    }) as unknown as NonNullable<GradedParticipantQuery['participant']>

    const client = {
      executeQuery: () =>
        fromValue<{ data: GradedParticipantQuery }>({
          data: {
            participant,
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ParticipantGrade />
      </Provider>,
      {},
      { initialEntries: [`/courses/course-id/grading/${participant.id}`] },
    )

    expect(
      screen.getByText(participant.profile.fullName ?? ''),
    ).toBeInTheDocument()
    expect(screen.getByText('Pass')).toBeInTheDocument()
  })

  it('displays modules and lessons from the graded on field if feature flag is enabled', () => {
    useFeatureFlagEnabledMock.mockReturnValue(true)

    const coveredLesson = buildLesson({ covered: true })
    const notCoveredLesson = buildLesson({ covered: false })

    const firstModule = buildModuleV2({
      name: 'Theory',
      note: 'Note',
      lessons: { items: [coveredLesson, notCoveredLesson] },
    })

    const secondModule = buildModuleV2({
      name: 'Second module',
      lessons: { items: [buildLesson({ covered: true })] },
    })

    const participant = buildGradedParticipant({
      grade: Grade_Enum.Pass,
      gradedOn: [firstModule, secondModule],
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: GradedParticipantQuery }>({
          data: {
            participant,
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ParticipantGrade />
      </Provider>,
      {},
      { initialEntries: [`/courses/course-id/grading/${participant.id}`] },
    )

    const firstModuleElem = screen.getByTestId(
      `graded-module-group-${firstModule.id}`,
    )

    const secondModuleElem = screen.getByTestId(
      `graded-module-group-${secondModule.id}`,
    )

    expect(
      within(firstModuleElem).getByText(coveredLesson.name),
    ).toBeInTheDocument()

    expect(
      within(firstModuleElem).getByText('1 of 2 completed'),
    ).toBeInTheDocument()

    const incompleteModulesElem =
      within(firstModuleElem).getByTestId('incomplete-modules')

    expect(
      within(incompleteModulesElem).getByText(notCoveredLesson.name),
    ).toBeInTheDocument()

    expect(
      within(secondModuleElem).queryByText('Incomplete'),
    ).not.toBeInTheDocument()

    expect(
      within(secondModuleElem).getByText('1 of 1 completed'),
    ).toBeInTheDocument()
  })

  it('navigates back to the course details page with grading query param', async () => {
    useFeatureFlagEnabledMock.mockReturnValue(false)

    const client = {
      executeQuery: () =>
        fromValue<{ data: GradedParticipantQuery }>({
          data: {
            participant: buildParticipant() as unknown as NonNullable<
              GradedParticipantQuery['participant']
            >,
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            element={<ParticipantGrade />}
            path="/courses/:id/grading/:participant-id"
          />
          <Route
            element={<MockCourseDetails />}
            path={'/courses/:id/details'}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/courses/course-id/grading/participant-id`] },
    )

    await userEvent.click(screen.getByText('Back to course details'))

    await waitFor(() => {
      expect(screen.getByText('GRADING')).toBeInTheDocument()
    })
  })
})
