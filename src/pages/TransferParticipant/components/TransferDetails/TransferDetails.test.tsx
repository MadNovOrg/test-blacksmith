import { addDays } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  TransferFeeType,
} from '@app/generated/graphql'

import { render, renderHook, screen, userEvent, waitFor } from '@test/index'

import { EligibleCourse } from '../../types'
import {
  ChosenParticipant,
  FromCourse,
  TransferModeEnum,
  TransferParticipantProvider,
  useTransferParticipantContext,
} from '../TransferParticipantProvider'

import { TransferDetails } from '.'

describe('page: TransferDetails', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('redirects to the first step if there is no chosen course', async () => {
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
            <Route path="/details" element={<TransferDetails />} />
            <Route path="/" element={<p>First step</p>} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/details'] }
    )

    await waitFor(() => {
      expect(screen.getByText('First step')).toBeInTheDocument()
    })
  })

  it('navigates back to the previous step', async () => {
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
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
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
          initialValue={{ fromCourse, participant, toCourse }}
          participantId={participant.id}
          courseId={fromCourse.id}
        >
          <Routes>
            <Route
              path="/transfer/:participantId/details"
              element={<TransferDetails />}
            />
            <Route
              path="/transfer/:participantId"
              element={<p>First step</p>}
            />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/transfer/participant-id/details'] }
    )

    await userEvent.click(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.back-btn-label')
      )
    )

    await waitFor(() => {
      expect(screen.getByText('First step')).toBeInTheDocument()
    })
  })

  it(`navigates to the review step when fee type is ${TransferFeeType.ApplyTerms}`, async () => {
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
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const ReviewMock: React.FC<React.PropsWithChildren<unknown>> = () => {
      const { fees } = useTransferParticipantContext()

      return (
        <>
          <p>{fees?.type}</p>
          <p>{fees?.customFee}</p>
        </>
      )
    }

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          participantId={participant.id}
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
        >
          <Routes>
            <Route
              path="/transfer/:participantId/details"
              element={<TransferDetails />}
            />
            <Route path="/review" element={<ReviewMock />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/transfer/participant-id/details'] }
    )

    await userEvent.click(
      screen.getByLabelText(
        t('pages.transfer-participant.transfer-details.apply-terms-option')
      )
    )

    expect(screen.getByTestId('transfer-terms-table')).toBeInTheDocument()

    const transferReasonField = screen.getByTestId('reasonForTransfer-input')
    await userEvent.type(transferReasonField, 'Why not?')

    await userEvent.click(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.next-btn-label')
      )
    )

    await waitFor(() => {
      expect(screen.getByText('APPLY_TERMS')).toBeInTheDocument()
    })
  })

  it(`navigates to the review step when fee type is ${TransferFeeType.CustomFee}`, async () => {
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
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const ReviewMock: React.FC<React.PropsWithChildren<unknown>> = () => {
      const { fees } = useTransferParticipantContext()

      return (
        <>
          <p>{fees?.type}</p>
          <p>{fees?.customFee}</p>
        </>
      )
    }

    render(
      <Provider value={client}>
        <TransferParticipantProvider
          participantId={participant.id}
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
        >
          <Routes>
            <Route
              path="/transfer/:participantId/details"
              element={<TransferDetails />}
            />
            <Route path="/review" element={<ReviewMock />} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/transfer/participant-id/details'] }
    )

    await userEvent.click(
      screen.getByLabelText(
        t('pages.transfer-participant.review-transfer.custom-fee')
      )
    )
    await userEvent.type(
      screen.getByLabelText(t('components.fees-form.custom-fee-label')),
      '50'
    )

    const transferReasonField = screen.getByTestId('reasonForTransfer-input')
    await userEvent.type(transferReasonField, 'Why not?')

    expect(screen.queryByTestId('transfer-terms-table')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.next-btn-label')
      )
    )

    await waitFor(() => {
      expect(screen.getByText(TransferFeeType.CustomFee)).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
    })
  })

  it('validates the fee amount field if fee type is custom fee', async () => {
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
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
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
          participantId={participant.id}
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
        >
          <Routes>
            <Route
              path="/transfer/:participantId/details"
              element={<TransferDetails />}
            />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/transfer/participant-id/details'] }
    )

    await userEvent.click(
      screen.getByLabelText(
        t('pages.transfer-participant.review-transfer.custom-fee')
      )
    )

    expect(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.next-btn-label')
      )
    ).toBeDisabled()
  })

  it("doesn't display fee options when an org admin is doing the transfer", async () => {
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
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      freeSlots: 2,
      reaccreditation: false,
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
          participantId={participant.id}
          courseId={fromCourse.id}
          initialValue={{
            fromCourse,
            participant,
            toCourse,
          }}
          mode={TransferModeEnum.ORG_ADMIN_TRANSFERS}
        >
          <Routes>
            <Route
              path="/transfer/:participantId/details"
              element={<TransferDetails />}
            />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/transfer/participant-id/details'] }
    )

    await waitFor(() => {
      expect(
        screen.queryByLabelText(
          t('pages.transfer-participant.transfer-details.apply-terms-option')
        )
      ).not.toBeInTheDocument()

      expect(
        screen.queryByLabelText(
          t('pages.transfer-participant.review-transfer.custom-fee')
        )
      ).not.toBeInTheDocument()
      expect(
        screen.queryByLabelText(t('components.fees-form.no-fee-option'))
      ).not.toBeInTheDocument()

      expect(screen.getByTestId('transfer-terms-table')).toBeInTheDocument()
    })
  })
})
