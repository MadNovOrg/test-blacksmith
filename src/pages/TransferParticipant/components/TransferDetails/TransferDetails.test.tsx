import { addDays } from 'date-fns'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import { render, screen, userEvent, waitFor } from '@test/index'

import { EligibleCourse, FeeType } from '../../types'
import {
  ChosenParticipant,
  FromCourse,
  TransferParticipantProvider,
  useTransferParticipantContext,
} from '../TransferParticipantProvider'

import { TransferDetails } from '.'

describe('page: TransferDetails', () => {
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
      <MemoryRouter initialEntries={['/details']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant }}
          >
            <Routes>
              <Route path="/details" element={<TransferDetails />} />
              <Route path="/" element={<p>First step</p>} />
            </Routes>
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
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
      level: Course_Level_Enum.Level_1,
      schedule: [
        {
          start: new Date().toISOString(),
          end: addDays(new Date(), 1).toISOString(),
        },
      ],
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    render(
      <MemoryRouter initialEntries={['/transfer/participant-id/details']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant, toCourse }}
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
        </Provider>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText(/Back to selection/i))

    await waitFor(() => {
      expect(screen.getByText('First step')).toBeInTheDocument()
    })
  })

  it(`navigates to the review step when fee type is ${FeeType.APPLY_TERMS}`, async () => {
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
      level: Course_Level_Enum.Level_1,
      schedule: [
        {
          start: new Date().toISOString(),
          end: addDays(new Date(), 1).toISOString(),
        },
      ],
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const ReviewMock: React.FC = () => {
      const { fees } = useTransferParticipantContext()

      return (
        <>
          <p>{fees?.type}</p>
          <p>{fees?.customFee}</p>
        </>
      )
    }

    render(
      <MemoryRouter initialEntries={['/transfer/participant-id/details']}>
        <Provider value={client}>
          <TransferParticipantProvider
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
        </Provider>
      </MemoryRouter>
    )

    userEvent.click(screen.getByLabelText(/apply transfer terms/i))

    expect(screen.getByTestId('transfer-terms-table')).toBeInTheDocument()

    await waitFor(() => {
      userEvent.click(screen.getByText(/review & confirm/i))
    })

    await waitFor(() => {
      expect(screen.getByText('APPLY_TERMS')).toBeInTheDocument()
    })
  })

  it(`navigates to the review step when fee type is ${FeeType.CUSTOM_FEE}`, async () => {
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
      level: Course_Level_Enum.Level_1,
      schedule: [
        {
          start: new Date().toISOString(),
          end: addDays(new Date(), 1).toISOString(),
        },
      ],
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    const ReviewMock: React.FC = () => {
      const { fees } = useTransferParticipantContext()

      return (
        <>
          <p>{fees?.type}</p>
          <p>{fees?.customFee}</p>
        </>
      )
    }

    render(
      <MemoryRouter initialEntries={['/transfer/participant-id/details']}>
        <Provider value={client}>
          <TransferParticipantProvider
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
        </Provider>
      </MemoryRouter>
    )

    userEvent.click(screen.getByLabelText(/custom fee/i))
    userEvent.type(screen.getByLabelText(/amount/i), '50')

    expect(screen.queryByTestId('transfer-terms-table')).not.toBeInTheDocument()

    await waitFor(() => {
      userEvent.click(screen.getByText(/review & confirm/i))
    })

    await waitFor(() => {
      expect(screen.getByText(FeeType.CUSTOM_FEE)).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
    })
  })
})
