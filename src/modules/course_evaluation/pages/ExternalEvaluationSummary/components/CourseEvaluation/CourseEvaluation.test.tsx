import { Route, Routes } from 'react-router-dom'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  GetCourseEvaluationQuestionsQuery,
  GetCourseParticipantIdQuery,
  GetEvaluationQuery,
  GetFeedbackUsersQuery,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { QUERY as GET_ANSWERS_QUERY } from '@app/modules/course_evaluation/queries/get-answers'
import { QUERY as GET_FEEDBACK_USERS_QUERY } from '@app/modules/course_evaluation/queries/get-feedback-users'
import { QUERY as GET_COURSE_EVALUATION_QUESTIONS_QUERY } from '@app/modules/course_evaluation/queries/get-questions'
import { GET_PARTICIPANT } from '@app/queries/participants/get-course-participant-by-profile-id'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import {
  buildAttendeeCourseEvaluationAnswers,
  buildCourse,
  buildCourseEvaluationQuestions,
  buildCourseParticipantOliver,
  buildFeedbackUsers,
} from '@test/mock-data-utils'

import { CourseEvaluation } from '.'

vi.mock('@app/hooks/useCourse')

const useCourseMocked = vi.mocked(useCourse)

describe('CourseEvaluation page', () => {
  const attendeeId = '6b72504a-6447-4b30-9909-e8e6fc1d300f'
  const course = buildCourse()
  const questions = buildCourseEvaluationQuestions()
  const courseParticipant = buildCourseParticipantOliver()
  const feedbackUsers = buildFeedbackUsers()
  const courseEvaluationAnswers = buildAttendeeCourseEvaluationAnswers()
  beforeEach(() => {
    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })
  })

  it('renders course evaluation questions', async () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_FEEDBACK_USERS_QUERY) {
          return fromValue<{ data: GetFeedbackUsersQuery }>({
            data: feedbackUsers,
          })
        }
        if (query === GET_ANSWERS_QUERY) {
          return fromValue<{ data: GetEvaluationQuery }>({
            data: courseEvaluationAnswers,
          })
        }
        if (query === GET_COURSE_EVALUATION_QUESTIONS_QUERY)
          return fromValue<{ data: GetCourseEvaluationQuestionsQuery }>({
            data: questions,
          })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/manage-courses/:orgid/:id/evaluation/view"
            element={<CourseEvaluation />}
          />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      {
        initialEntries: [
          `/manage-courses/all/${course.id}/evaluation/view?profile_id=${attendeeId}`,
        ],
      }
    )

    expect(screen.getByText('Additional comments')).toBeInTheDocument()
  })

  it('renders course evaluation questions', async () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_PARTICIPANT) {
          return fromValue<{ data: GetCourseParticipantIdQuery }>({
            data: courseParticipant,
          })
        }

        if (query === GET_COURSE_EVALUATION_QUESTIONS_QUERY)
          return fromValue<{ data: GetCourseEvaluationQuestionsQuery }>({
            data: questions,
          })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/courses/:id/evaluation"
            element={<CourseEvaluation />}
          />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.USER } },
      {
        initialEntries: [`/courses/${course.id}/evaluation`],
      }
    )

    expect(screen.getByText('Additional comments')).toBeInTheDocument()
  })
})
