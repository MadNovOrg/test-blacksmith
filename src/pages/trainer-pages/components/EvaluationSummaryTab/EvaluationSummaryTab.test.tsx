import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { render, screen, userEvent } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { EvaluationSummaryTab } from './EvaluationSummaryTab'

jest.mock('swr')

const useSWRMock = jest.mocked(useSWR)

describe('component: EvaluationSummaryTab', () => {
  it('displays a spinner while data is loading', () => {
    useSWRMock.mockReturnValue({
      data: null,
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/1/details']}>
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab />}
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('evaluations-fetching')).toBeInTheDocument()
  })

  it("doesn't display an alert message for the trainer to submit the course evaluation if all participants haven't submitted their evaluations", () => {
    const MOCK_TRAINER_ID = 'trainer-id'

    const mockEvaluations = [
      { id: '1', profile: buildProfile() },
      { id: '2', profile: buildProfile() },
      {
        id: '3',
        profile: buildProfile({
          overrides: {
            id: MOCK_TRAINER_ID,
          },
        }),
      },
    ]

    useSWRMock.mockReturnValue({
      data: {
        evaluations: mockEvaluations,
        courseParticipantsAggregation: { aggregate: { count: 3 } },
      },
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/1/details']}>
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab />}
          />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          profile: { id: MOCK_TRAINER_ID },
        },
      }
    )

    expect(screen.queryByText('Complete my evaluation')).not.toBeInTheDocument()
  })

  it("displays participants' evaluations in the table while ommiting trainer's evaluation", () => {
    const MOCK_TRAINER_ID = 'trainer-id'

    const mockEvaluations = [
      { id: '1', profile: buildProfile() },
      {
        id: '2',
        profile: buildProfile({
          overrides: {
            id: MOCK_TRAINER_ID,
          },
        }),
      },
    ]

    useSWRMock.mockReturnValue({
      data: {
        evaluations: mockEvaluations,
        courseParticipantsAggregation: { aggregate: { count: 3 } },
      },
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/1/details']}>
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab />}
          />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          profile: { id: MOCK_TRAINER_ID },
        },
      }
    )

    expect(
      screen.getByText(mockEvaluations[0].profile.fullName)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(mockEvaluations[1].profile.fullName)
    ).not.toBeInTheDocument()
  })

  it("navigates to trainer's evaluation submit page when submit evaluation button is clicked", () => {
    const MOCK_TRAINER_ID = 'trainer-id'

    const mockEvaluations = [
      { id: '1', profile: buildProfile() },
      { id: '2', profile: buildProfile() },
    ]

    useSWRMock.mockReturnValue({
      data: {
        evaluations: mockEvaluations,
        courseParticipantsAggregation: { aggregate: { count: 2 } },
      },
      error: null,
      isValidating: false,
      mutate: jest.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/courses/1/details']}>
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab />}
          />
          <Route path="/evaluation/submit" element={<p>Evaluation submit</p>} />
        </Routes>
      </MemoryRouter>,
      {
        auth: {
          profile: { id: MOCK_TRAINER_ID },
        },
      }
    )

    userEvent.click(screen.getByText('Complete my evaluation'))

    expect(screen.getByText('Evaluation submit')).toBeInTheDocument()
  })
})
