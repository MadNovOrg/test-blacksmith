import { addDays } from 'date-fns'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  TransferEligibleCoursesQuery,
  TransferEligibleCoursesQueryVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor } from '@test/index'

import {
  ChosenParticipant,
  FromCourse,
  TransferParticipantProvider,
  useTransferParticipantContext,
} from '../TransferParticipantProvider'

import { ChooseTransferCourse } from '.'

describe('page: ChooseTransferCourse', () => {
  it('displays an alert if there are no eligible courses for transfer', () => {
    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      end: addDays(new Date(), 1).toISOString(),
      type: Course_Type_Enum.Open,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const client = {
      executeQuery: () =>
        fromValue<{ data: TransferEligibleCoursesQuery }>({
          data: {
            eligibleCourses: [],
          },
        }),
    } as unknown as Client

    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{
              fromCourse,
              participant,
            }}
          >
            <ChooseTransferCourse />
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"No eligible courses for transfer at the moment"`
    )
  })

  it('displays eligible courses and can select a course to transfer to', async () => {
    const fromStartDate = new Date()
    const TO_COURSE_ID = 2

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: fromStartDate.toISOString(),
      end: addDays(fromStartDate, 1).toISOString(),
      type: Course_Type_Enum.Open,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const MockTransferDetails: React.FC = () => {
      const { toCourse } = useTransferParticipantContext()

      return <p>choosen course for transfer is {toCourse?.id}</p>
    }

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TransferEligibleCoursesQueryVariables
      }) => {
        const variablesMatch =
          variables.level === fromCourse.level &&
          variables.startDate === fromCourse.start

        return fromValue<{ data: TransferEligibleCoursesQuery }>({
          data: {
            eligibleCourses: variablesMatch
              ? [
                  {
                    id: TO_COURSE_ID,
                    level: Course_Level_Enum.Level_1,
                    course_code: 'course-code',
                    schedule: [
                      {
                        venue: null,
                        start: new Date().toISOString(),
                        end: new Date().toISOString(),
                        virtualLink: '',
                      },
                    ],
                  },
                ]
              : [],
          },
        })
      },
    } as unknown as Client

    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{
              fromCourse,
              participant,
            }}
          >
            <Routes>
              <Route index element={<ChooseTransferCourse />} />
              <Route path="details" element={<MockTransferDetails />} />
            </Routes>
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
    )

    userEvent.click(screen.getByLabelText(TO_COURSE_ID))
    userEvent.click(screen.getByText(/transfer details/i))

    await waitFor(() => {
      expect(screen.getByText(`choosen course for transfer is ${TO_COURSE_ID}`))
    })
  })
})
