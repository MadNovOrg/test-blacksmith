import { addDays } from 'date-fns'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  CourseDeliveryType,
  CourseType,
  Course_Delivery_Type_Enum,
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
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
            eligibleTransferCourses: [],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{
            fromCourse,
            participant,
          }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <ChooseTransferCourse />
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/'] }
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const MockTransferDetails: React.FC<
      React.PropsWithChildren<unknown>
    > = () => {
      const { toCourse } = useTransferParticipantContext()

      return <p>chosen course for transfer is {toCourse?.id}</p>
    }

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: TransferEligibleCoursesQueryVariables
      }) => {
        const variablesMatch =
          variables.fromCourseId === fromCourse.id &&
          variables.participantId === participant.id

        return fromValue<{ data: TransferEligibleCoursesQuery }>({
          data: {
            eligibleTransferCourses: variablesMatch
              ? [
                  {
                    id: TO_COURSE_ID,
                    courseCode: 'course-code',
                    startDate: new Date().toISOString(),
                    endDate: new Date().toISOString(),
                    freeSlots: 2,
                    reaccreditation: false,
                    deliveryType: CourseDeliveryType.F2F,
                    type: CourseType.Open,
                  },
                ]
              : [],
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{
            fromCourse,
            participant,
          }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route index element={<ChooseTransferCourse />} />
            <Route path="details" element={<MockTransferDetails />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/'] }
    )

    await userEvent.click(screen.getByLabelText(TO_COURSE_ID))
    await userEvent.click(screen.getByText(/transfer details/i))

    await waitFor(() => {
      expect(
        screen.getByText(`chosen course for transfer is ${TO_COURSE_ID}`)
      ).toBeInTheDocument()
    })
  })
})
