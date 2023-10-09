import { Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { Course_Status_Enum } from '@app/generated/graphql'

import { render, screen, userEvent } from '@test/index'
import { buildProfile, buildCourse } from '@test/mock-data-utils'

import { EvaluationSummaryTab } from './EvaluationSummaryTab'

vi.mock('swr')

const useSWRMock = vi.mocked(useSWR)

const baseSWRMockData = {
  data: null,
  error: null,
  isValidating: false,
  mutate: vi.fn(),
  isLoading: false,
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

const course = buildCourse({
  overrides: {
    status: Course_Status_Enum.GradeMissing,
  },
})

describe('component: EvaluationSummaryTab', () => {
  it('displays a spinner while data is loading', () => {
    useSWRMock.mockReturnValue(baseSWRMockData)

    render(
      <Routes>
        <Route
          path="/courses/:id/details"
          element={<EvaluationSummaryTab course={course} />}
        />
      </Routes>,
      {},
      { initialEntries: ['/courses/1/details'] }
    )

    expect(screen.queryByTestId('evaluations-fetching')).toBeInTheDocument()
  })

  describe(`doesn't display an alert message if course status is different from ${Course_Status_Enum.GradeMissing} or ${Course_Status_Enum.EvaluationMissing}`, () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
      { id: '3', profile: attendees[2].profile },
    ]

    it(`lead trainer and course status is ${Course_Status_Enum.Scheduled}`, () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
      })

      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={buildCourse({})} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
      )
      expect(
        screen.queryByText('Complete my evaluation')
      ).not.toBeInTheDocument()
    })
  })

  describe(`displays an alert message for the leader trainer to submit the course evaluation if course is in status ${Course_Status_Enum.GradeMissing} or ${Course_Status_Enum.EvaluationMissing}`, () => {
    const evaluations = [
      { id: '1', profile: attendees[0].profile },
      { id: '2', profile: attendees[1].profile },
      { id: '3', profile: attendees[2].profile },
      { id: '4', profile: trainers[1].profile },
    ]

    it(`leader trainer and course status is ${Course_Status_Enum.GradeMissing}`, () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
      })

      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
      )
      expect(screen.queryByText('Complete my evaluation')).toBeInTheDocument()
    })

    it(`leader trainer and course status is ${Course_Status_Enum.EvaluationMissing}`, () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
      })

      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={
              <EvaluationSummaryTab
                course={buildCourse({
                  overrides: { status: Course_Status_Enum.EvaluationMissing },
                })}
              />
            }
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
      )
      expect(screen.queryByText('Complete my evaluation')).toBeInTheDocument()
    })

    it('assistant trainer', () => {
      useSWRMock.mockReturnValue({
        ...baseSWRMockData,
        data: { evaluations, attendees, trainers },
      })

      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[1].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
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
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
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
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[1].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
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
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
      )

      for (const evaluation of evaluations) {
        if (evaluation.profile.id !== trainers[0].profile.id) {
          expect(
            screen.queryByText(evaluation.profile.fullName)
          ).toBeInTheDocument()
        } else {
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
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[1].profile.id } } },
        { initialEntries: ['/courses/1/details'] }
      )

      for (const evaluation of evaluations) {
        if (evaluation.profile.id !== trainers[1].profile.id) {
          expect(
            screen.queryByText(evaluation.profile.fullName)
          ).toBeInTheDocument()
        } else {
          expect(
            screen.queryByText(evaluation.profile.fullName)
          ).not.toBeInTheDocument()
        }
      }
    })
  })

  it("navigates to trainer's evaluation submit page when submit evaluation button is clicked", async () => {
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
      <Routes>
        <Route
          path="/courses/:id/details"
          element={<EvaluationSummaryTab course={course} />}
        />
        <Route path="/evaluation/submit" element={<p>Evaluation submit</p>} />
      </Routes>,
      { auth: { profile: { id: trainers[0].profile.id } } },
      { initialEntries: ['/courses/1/details'] }
    )

    await userEvent.click(screen.getByText('Complete my evaluation'))

    expect(screen.queryByText('Evaluation submit')).toBeInTheDocument()
  })
})
