import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Evaluation_Question_Type_Enum,
  GetCourseEvaluationQuestionsQuery,
  GetEvaluationQuery,
} from '@app/generated/graphql'
import { GET_ANSWERS_QUERY } from '@app/modules/course_details/course_evaluation_tab/queries/get-answers'
import { GET_COURSE_EVALUATION_QUESTIONS_QUERY } from '@app/modules/course_details/course_evaluation_tab/queries/get-questions'

import { render, screen, chance } from '@test/index'

import { TrainerFeedback } from './index'

describe('TrainerFeedback component', () => {
  const trainerName = chance.name()

  it('renders TrainerFeedback', async () => {
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_ANSWERS_QUERY) {
          return fromValue<{ data: GetEvaluationQuery }>({
            data: {
              answers: [
                {
                  id: chance.guid(),
                  question: {
                    id: chance.guid(),
                    type: Course_Evaluation_Question_Type_Enum.Text,
                  },
                  profile: {
                    fullName: trainerName,
                  },
                  answer: chance.string(),
                },
                {
                  id: chance.guid(),
                  question: {
                    id: chance.guid(),
                    type: Course_Evaluation_Question_Type_Enum.Text,
                  },
                  profile: {
                    fullName: trainerName,
                  },
                  answer: chance.string(),
                },
                {
                  id: chance.guid(),
                  question: {
                    id: chance.guid(),
                    type: null,
                  },
                  profile: {
                    fullName: trainerName,
                  },
                  answer: trainerName,
                },
                {
                  id: chance.guid(),
                  question: {
                    id: chance.guid(),
                    type: Course_Evaluation_Question_Type_Enum.BooleanReasonY,
                  },
                  profile: {
                    fullName: trainerName,
                  },
                  answer: 'YES-24/03/2023',
                },
              ],
            },
          })
        }
        if (query === GET_COURSE_EVALUATION_QUESTIONS_QUERY) {
          return fromValue<{ data: GetCourseEvaluationQuestionsQuery }>({
            data: {
              questions: [
                {
                  id: '6c6d233d-ad6b-4db2-9707-5853c74584a0',
                  type: Course_Evaluation_Question_Type_Enum.BooleanReasonY,
                  questionKey: 'ANY_INJURIES',
                  group: null,
                  displayOrder: 0,
                  required: true,
                },
                {
                  id: 'ad3caf4d-a2c7-477a-9dfa-cd22adac16dc',
                  type: Course_Evaluation_Question_Type_Enum.Text,
                  questionKey: 'ISSUES_ARISING_FROM_COURSE',
                  group: null,
                  displayOrder: 1,
                  required: true,
                },
                {
                  id: '1ce0b2e6-6a02-40cf-a0d6-f6ccca775354',
                  type: Course_Evaluation_Question_Type_Enum.Text,
                  questionKey: 'TRAINER_COMMENTS',
                  group: null,
                  displayOrder: 2,
                  required: true,
                },
                {
                  id: 'acaf83a1-78f8-4380-822a-bd06c2f5592c',
                  type: null,
                  questionKey: 'SIGNATURE',
                  group: null,
                  displayOrder: 999,
                  required: true,
                },
              ],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <TrainerFeedback />
      </Provider>,
    )
    expect(screen.getByText('Trainer summary evaluation')).toBeInTheDocument()
  })
})
