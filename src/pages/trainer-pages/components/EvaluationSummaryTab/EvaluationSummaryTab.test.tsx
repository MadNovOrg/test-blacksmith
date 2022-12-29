import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { render, screen, userEvent } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { EvaluationSummaryTab } from './EvaluationSummaryTab'

jest.mock('swr')

const useSWRMock = jest.mocked(useSWR)

const baseSWRMockData = {
  data: null,
  error: null,
  isValidating: false,
  mutate: jest.fn(),
}

const attendees = [
  { id: '1', profile: buildProfile() },
  { id: '2', profile: buildProfile() },
  { id: '3', profile: buildProfile() },
]

const trainers = [
  { id: '1', type: 'LEADER', profile: buildProfile() },
  { id: '2', type: 'ASSISTANT', profile: buildProfile() },
]

describe('component: EvaluationSummaryTab', () => {
  it('displays a spinner while data is loading', () => {
    useSWRMock.mockReturnValue(baseSWRMockData)

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

    expect(screen.queryByTestId('evaluations-fetching')).toBeInTheDocument()
  })

  describe("doesn't display an alert message for any trainer to submit the course evaluation if any attendee hasn't submitted their evaluation", () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
    ]

    it('lead trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[0].profile.id } } }
      )
      expect(
        screen.queryByText('Complete my evaluation')
      ).not.toBeInTheDocument()
    })

    it('assistant trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[1].profile.id } } }
      )
      expect(
        screen.queryByText('Complete my evaluation')
      ).not.toBeInTheDocument()
    })
  })

  describe("doesn't display an alert message for the leader trainer to submit the course evaluation if any assistant trainer hasn't submitted their evaluation", () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
      { id: '3', profile: attendees[2].profile },
    ]

    it('lead trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[0].profile.id } } }
      )
      expect(
        screen.queryByText('Complete my evaluation')
      ).not.toBeInTheDocument()
    })

    it('assistant trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[1].profile.id } } }
      )
      expect(screen.queryByText('Complete my evaluation')).toBeInTheDocument()
    })
  })

  describe('displays an alert message for the leader trainer to submit the course evaluation if all attendees and assistant trainers have submitted their evaluations', () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
      { id: '3', profile: attendees[2].profile },
      { id: '4', profile: trainers[1].profile },
    ]

    it('leader trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[0].profile.id } } }
      )
      expect(screen.queryByText('Complete my evaluation')).toBeInTheDocument()
    })

    it('assistant trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[1].profile.id } } }
      )
      expect(
        screen.queryByText('Complete my evaluation')
      ).not.toBeInTheDocument()
    })
  })

  describe("doesn't display an alert message for the trainer to submit the course evaluation if they have already done so", () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
      { id: '3', profile: attendees[2].profile },
      { id: '4', profile: trainers[1].profile },
      { id: '5', profile: trainers[0].profile },
    ]

    it('leader trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[0].profile.id } } }
      )
      expect(
        screen.queryByText('Complete my evaluation')
      ).not.toBeInTheDocument()
    })

    it('assistant trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[1].profile.id } } }
      )
      expect(
        screen.queryByText('Complete my evaluation')
      ).not.toBeInTheDocument()
    })
  })

  describe("displays all but the trainer's evaluations in a table", () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
      { id: '3', profile: attendees[2].profile },
      { id: '4', profile: trainers[1].profile },
      { id: '5', profile: trainers[0].profile },
    ]

    it('leader trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[0].profile.id } } }
      )

      for (const evaluation of evaluations) {
        if (evaluation.profile.id !== trainers[0].profile.id) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(
            screen.queryByText(evaluation.profile.fullName)
          ).toBeInTheDocument()
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(
            screen.queryByText(evaluation.profile.fullName)
          ).not.toBeInTheDocument()
        }
      }
    })

    it('assistant trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
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
        { auth: { profile: { id: trainers[1].profile.id } } }
      )

      for (const evaluation of evaluations) {
        if (evaluation.profile.id !== trainers[1].profile.id) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(
            screen.queryByText(evaluation.profile.fullName)
          ).toBeInTheDocument()
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(
            screen.queryByText(evaluation.profile.fullName)
          ).not.toBeInTheDocument()
        }
      }
    })
  })

  it("navigates to trainer's evaluation submit page when submit evaluation button is clicked", () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
      { id: '3', profile: attendees[2].profile },
      { id: '4', profile: trainers[1].profile },
    ]

    useSWRMock.mockReturnValue({
      ...baseSWRMockData,
      data: { evaluations, attendees, trainers },
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
      { auth: { profile: { id: trainers[0].profile.id } } }
    )

    userEvent.click(screen.getByText('Complete my evaluation'))

    expect(screen.queryByText('Evaluation submit')).toBeInTheDocument()
  })
})
