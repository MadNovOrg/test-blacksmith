import React from 'react'
import useSWR from 'swr'

import { render, screen, useSWRDefaultResponse, chance } from '@test/index'

import { TrainerFeedback } from './index'

jest.mock('@app/lib/gql-request')

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)

describe('TrainerFeedback component', () => {
  const trainerName = chance.name()

  it('renders TrainerFeedback', async () => {
    useSWRMock.mockReturnValue({
      ...useSWRDefaultResponse,
      data: {
        answers: [
          {
            question: {
              id: 'ad3caf4d-a2c7-477a-9dfa-cd22adac16dc',
              type: 'TEXT',
            },
            profile: {
              trainerName,
            },
            answer: chance.string(),
          },
          {
            question: {
              id: '1ce0b2e6-6a02-40cf-a0d6-f6ccca775354',
              type: 'TEXT',
            },
            profile: {
              trainerName,
            },
            answer: chance.string(),
          },
          {
            question: {
              id: 'acaf83a1-78f8-4380-822a-bd06c2f5592c',
              type: null,
            },
            profile: {
              trainerName,
            },
            answer: trainerName,
          },
          {
            question: {
              id: '6c6d233d-ad6b-4db2-9707-5853c74584a0',
              type: 'BOOLEAN_REASON_Y',
            },
            profile: {
              trainerName,
            },
            answer: 'YES-24/03/2023',
          },
        ],
        questions: [
          {
            id: '6c6d233d-ad6b-4db2-9707-5853c74584a0',
            type: 'BOOLEAN_REASON_Y',
            questionKey: 'ANY_INJURIES',
            group: null,
            displayOrder: 0,
            required: true,
          },
          {
            id: 'ad3caf4d-a2c7-477a-9dfa-cd22adac16dc',
            type: 'TEXT',
            questionKey: 'ISSUES_ARISING_FROM_COURSE',
            group: null,
            displayOrder: 1,
            required: true,
          },
          {
            id: '1ce0b2e6-6a02-40cf-a0d6-f6ccca775354',
            type: 'TEXT',
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

    render(<TrainerFeedback />)
    expect(screen.getByText('Trainer summary evaluation')).toBeInTheDocument()
  })
})
