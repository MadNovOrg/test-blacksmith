import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  GetEvaluationsQuery,
} from '@app/generated/graphql'

import { render, screen, userEvent } from '@test/index'
import { buildProfile, buildCourse } from '@test/mock-data-utils'

import { EvaluationSummaryTab } from './EvaluationSummaryTab'

const attendees = [
  { id: '1', profile: buildProfile() },
  { id: '2', profile: buildProfile() },
  { id: '3', profile: buildProfile() },
]

const trainers = [
  { id: '1', type: Course_Trainer_Type_Enum.Leader, profile: buildProfile() },
  {
    id: '2',
    type: Course_Trainer_Type_Enum.Assistant,
    profile: buildProfile(),
  },
]
const evaluations = [
  { id: '1', profile: attendees[0].profile },
  { id: '2', profile: attendees[1].profile },
  { id: '3', profile: attendees[2].profile },
  { id: '4', profile: trainers[1].profile },
]

const course = buildCourse({
  overrides: {
    status: Course_Status_Enum.GradeMissing,
  },
})

describe('component: EvaluationSummaryTab', () => {
  it('displays a spinner while data is loading', () => {
    render(
      <Routes>
        <Route
          path="/courses/:id/details"
          element={<EvaluationSummaryTab course={course} />}
        />
      </Routes>,
      {},
      { initialEntries: ['/courses/1/details'] },
    )

    expect(screen.queryByTestId('evaluations-fetching')).toBeInTheDocument()
  })

  describe(`doesn't display an alert message if course status is different from ${Course_Status_Enum.GradeMissing} or ${Course_Status_Enum.EvaluationMissing}`, () => {
    it(`lead trainer and course status is ${Course_Status_Enum.Scheduled}`, () => {
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={buildCourse({})} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )
      expect(
        screen.queryByText('Complete my evaluation'),
      ).not.toBeInTheDocument()
    })
  })

  describe(`displays an alert message for the leader trainer to submit the course evaluation if course is in status ${Course_Status_Enum.GradeMissing} or ${Course_Status_Enum.EvaluationMissing}`, () => {
    it(`leader trainer and course status is ${Course_Status_Enum.GradeMissing}`, () => {
      const client = {
        executeQuery: () =>
          fromValue<{ data: GetEvaluationsQuery }>({
            data: {
              evaluations,
              attendees,
              trainers,
            },
          }),
      } as unknown as Client
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={
              <Provider value={client}>
                <EvaluationSummaryTab course={course} />
              </Provider>
            }
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )
      expect(screen.queryByText('Complete my evaluation')).toBeInTheDocument()
    })

    it(`leader trainer and course status is ${Course_Status_Enum.EvaluationMissing}`, () => {
      const client = {
        executeQuery: () =>
          fromValue<{ data: GetEvaluationsQuery }>({
            data: {
              evaluations,
              attendees,
              trainers,
            },
          }),
      } as unknown as Client
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={
              <Provider value={client}>
                <EvaluationSummaryTab
                  course={buildCourse({
                    overrides: { status: Course_Status_Enum.EvaluationMissing },
                  })}
                />
              </Provider>
            }
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )
      expect(screen.queryByText('Complete my evaluation')).toBeInTheDocument()
    })

    it('assistant trainer', () => {
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[1].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )
      expect(
        screen.queryByText('Complete my evaluation'),
      ).not.toBeInTheDocument()
    })
  })

  describe("doesn't display an alert message for the trainer to submit the course evaluation if they have already done so", () => {
    it('leader trainer', () => {
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )
      expect(
        screen.queryByText('Complete my evaluation'),
      ).not.toBeInTheDocument()
    })

    it('assistant trainer', () => {
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={<EvaluationSummaryTab course={course} />}
          />
        </Routes>,
        { auth: { profile: { id: trainers[1].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )
      expect(
        screen.queryByText('Complete my evaluation'),
      ).not.toBeInTheDocument()
    })
  })

  describe("displays all but the trainer's evaluations in a table", () => {
    it('leader trainer', () => {
      const client = {
        executeQuery: () =>
          fromValue<{ data: GetEvaluationsQuery }>({
            data: {
              evaluations,
              attendees,
              trainers,
            },
          }),
      } as unknown as Client
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={
              <Provider value={client}>
                <EvaluationSummaryTab course={course} />
              </Provider>
            }
          />
        </Routes>,
        { auth: { profile: { id: trainers[0].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )

      for (const evaluation of evaluations) {
        if (evaluation.profile.id !== trainers[0].profile.id) {
          expect(
            screen.queryByText(new RegExp(evaluation.profile.fullName)),
          ).toBeInTheDocument()
        } else {
          expect(
            screen.queryByText(new RegExp(evaluation.profile.fullName)),
          ).not.toBeInTheDocument()
        }
      }
    })

    it('assistant trainer', () => {
      const client = {
        executeQuery: () =>
          fromValue<{ data: GetEvaluationsQuery }>({
            data: {
              evaluations,
              attendees,
              trainers,
            },
          }),
      } as unknown as Client
      render(
        <Routes>
          <Route
            path="/courses/:id/details"
            element={
              <Provider value={client}>
                <EvaluationSummaryTab course={course} />
              </Provider>
            }
          />
        </Routes>,
        { auth: { profile: { id: trainers[1].profile.id } } },
        { initialEntries: ['/courses/1/details'] },
      )

      for (const evaluation of evaluations) {
        if (evaluation.profile.id !== trainers[1].profile.id) {
          expect(
            screen.queryByText(new RegExp(evaluation.profile.fullName)),
          ).toBeInTheDocument()
        } else {
          expect(
            screen.queryByText(new RegExp(evaluation.profile.fullName)),
          ).not.toBeInTheDocument()
        }
      }
    })
  })

  it("navigates to trainer's evaluation submit page when submit evaluation button is clicked", async () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetEvaluationsQuery }>({
          data: {
            evaluations,
            attendees,
            trainers,
          },
        }),
    } as unknown as Client
    render(
      <Routes>
        <Route
          path="/courses/:id/details"
          element={
            <Provider value={client}>
              <EvaluationSummaryTab course={course} />
            </Provider>
          }
        />
        <Route path="/evaluation/submit" element={<p>Evaluation submit</p>} />
      </Routes>,
      { auth: { profile: { id: trainers[0].profile.id } } },
      { initialEntries: ['/courses/1/details'] },
    )

    await userEvent.click(screen.getByText('Complete my evaluation'))

    expect(screen.queryByText('Evaluation submit')).toBeInTheDocument()
  })
})
