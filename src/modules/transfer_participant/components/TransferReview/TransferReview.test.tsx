import { addDays } from 'date-fns'
import matches from 'lodash-es/matches'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import { useSnackbar } from '@app/context/snackbar'
import {
  CourseDeliveryType,
  CourseType,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  TransferFeeType,
  TransferParticipantError,
  TransferParticipantMutation,
  TransferParticipantMutationVariables,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { TRANSFER_PARTICIPANT } from '../../queries/queries'
import { EligibleCourse } from '../../utils/types'
import { getTransferTermsFee } from '../../utils/utils'
import {
  ChosenParticipant,
  ContextValue,
  FromCourse,
  TransferParticipantProvider,
} from '../TransferParticipantProvider'

import { TransferReview } from '.'

describe('page: TransferReview', () => {
  it('navigates to first step if there is no course to transfer to', async () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
    } as unknown as Client

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

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{ fromCourse, participant }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route path="/review" element={<TransferReview />} />
            <Route path="/" element={<p>First step</p>} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/review'] },
    )

    await waitFor(() => {
      expect(screen.getByText('First step')).toBeInTheDocument()
    })
  })

  it(`displays ${TransferFeeType.ApplyTerms} info properly`, async () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
    } as unknown as Client

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: addDays(new Date(), 20).toISOString(),
      end: addDays(new Date(), 20).toISOString(),
      type: Course_Type_Enum.Open,
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
      deliveryType: CourseDeliveryType.F2F,
      type: CourseType.Open,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const fees: ContextValue['fees'] = {
      type: TransferFeeType.ApplyTerms,
    }

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{ fromCourse, participant, toCourse, fees }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route path="/review" element={<TransferReview />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/review'] },
    )

    expect(screen.getByText('Apply transfer terms')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('fee-type-panel')).getByText(
        `${getTransferTermsFee(
          new Date(fromCourse?.start ?? ''),
          Course_Level_Enum.Level_1,
        )}% of payment due`,
      ),
    ).toBeInTheDocument()
  })

  it(`displays ${TransferFeeType.CustomFee} info properly`, () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
    } as unknown as Client

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: addDays(new Date(), 20).toISOString(),
      end: addDays(new Date(), 20).toISOString(),
      type: Course_Type_Enum.Open,
      priceCurrency: 'GBP',
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
      deliveryType: CourseDeliveryType.F2F,
      type: CourseType.Open,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const fees: ContextValue['fees'] = {
      type: TransferFeeType.CustomFee,
      customFee: 50,
    }

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{ fromCourse, participant, toCourse, fees }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route path="/review" element={<TransferReview />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/review'] },
    )

    expect(screen.getByText('Custom fee')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('fee-type-panel')).getByText('£50.00'),
    ).toBeInTheDocument()
  })

  it(`displays ${TransferFeeType.Free} info properly`, () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
    } as unknown as Client

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: addDays(new Date(), 20).toISOString(),
      end: addDays(new Date(), 20).toISOString(),
      type: Course_Type_Enum.Open,
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
      deliveryType: CourseDeliveryType.F2F,
      type: CourseType.Open,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const fees: ContextValue['fees'] = {
      type: TransferFeeType.Free,
    }

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{ fromCourse, participant, toCourse, fees }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route path="/review" element={<TransferReview />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/review'] },
    )

    expect(screen.queryByTestId('fee-type-panel')).not.toBeInTheDocument()
  })

  it('displays an alert if there is an error transferring the participant', async () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
      executeMutation: () => {
        return fromValue<{ data: TransferParticipantMutation }>({
          data: {
            transferParticipant: {
              success: false,
              error: TransferParticipantError.GeneralError,
            },
          },
        })
      },
    } as unknown as Client

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: addDays(new Date(), 40).toISOString(),
      end: addDays(new Date(), 40).toISOString(),
      type: Course_Type_Enum.Open,
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
      deliveryType: CourseDeliveryType.F2F,
      type: CourseType.Open,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const fees: ContextValue['fees'] = {
      type: TransferFeeType.ApplyTerms,
    }

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{ fromCourse, participant, toCourse, fees }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route path="/transfer/review" element={<TransferReview />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/transfer/review'] },
    )

    await userEvent.click(screen.getByText(/confirm transfer/i))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"There was an error transferring the participant"`,
      )
    })
  })

  it('transfers the participant and navigates to the course details page with the success query param', async () => {
    const TO_COURSE_ID = 2
    const PARTICIPANT_ID = 'participant-id'
    const CHOSEN_FEE_TYPE = TransferFeeType.ApplyTerms

    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
      executeMutation: ({
        variables,
        query,
      }: {
        variables: TransferParticipantMutationVariables
        query: TypedDocumentNode
      }) => {
        const mutationMatches = matches({
          query: TRANSFER_PARTICIPANT,
          variables: {
            input: {
              toCourseId: TO_COURSE_ID,
              participantId: PARTICIPANT_ID,
              fee: {
                type: CHOSEN_FEE_TYPE,
              },
            },
          } as TransferParticipantMutationVariables,
        })

        if (mutationMatches({ query, variables })) {
          return fromValue<{ data: TransferParticipantMutation }>({
            data: {
              transferParticipant: {
                success: true,
              },
            },
          })
        } else {
          return fromValue<{ data: TransferParticipantMutation }>({
            data: {
              transferParticipant: {
                success: false,
                error: TransferParticipantError.GeneralError,
              },
            },
          })
        }
      },
    } as unknown as Client

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: addDays(new Date(), 40).toISOString(),
      end: addDays(new Date(), 40).toISOString(),
      type: Course_Type_Enum.Open,
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
      deliveryType: CourseDeliveryType.F2F,
      type: CourseType.Open,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const fees: ContextValue['fees'] = {
      type: TransferFeeType.ApplyTerms,
    }

    const CourseDetailsMock = () => {
      const { getSnackbarMessage } = useSnackbar()

      const message = getSnackbarMessage('participant-transferred')

      return <p>{message?.label}</p>
    }

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          initialValue={{ fromCourse, participant, toCourse, fees }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route path="/transfer/review" element={<TransferReview />} />
            <Route path="/details" element={<CourseDetailsMock />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/transfer/review'] },
    )

    await userEvent.click(screen.getByText(/confirm transfer/i))

    await waitFor(() => {
      expect(screen.getByText(/participant transferred/i)).toBeInTheDocument()
    })
  })
})
