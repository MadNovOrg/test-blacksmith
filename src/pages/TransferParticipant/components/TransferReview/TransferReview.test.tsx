import { addDays } from 'date-fns'
import matches from 'lodash-es/matches'
import React from 'react'
import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom'
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  TransferParticipantMutation,
  TransferParticipantMutationVariables,
} from '@app/generated/graphql'

import { render, waitFor, screen, within, userEvent } from '@test/index'

import { TRANSFER_PARTICIPANT } from '../../queries'
import { EligibleCourse, FeeType } from '../../types'
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
    }

    const participant: ChosenParticipant = {
      id: 'participant-id',
      profile: {
        fullName: 'John Doe',
      },
    }

    render(
      <MemoryRouter initialEntries={['/review']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant }}
          >
            <Routes>
              <Route path="/review" element={<TransferReview />} />
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

  it(`displays ${FeeType.APPLY_TERMS} info properly`, async () => {
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

    const fees: ContextValue['fees'] = {
      type: FeeType.APPLY_TERMS,
    }

    render(
      <MemoryRouter initialEntries={['/review']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant, toCourse, fees }}
          >
            <Routes>
              <Route path="/review" element={<TransferReview />} />
            </Routes>
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Apply transfer terms')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('fee-type-panel')).getByText(
        '25% of payment due'
      )
    ).toBeInTheDocument()
  })

  it(`displays ${FeeType.CUSTOM_FEE} info properly`, () => {
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

    const fees: ContextValue['fees'] = {
      type: FeeType.CUSTOM_FEE,
      customFee: 50,
    }

    render(
      <MemoryRouter initialEntries={['/review']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant, toCourse, fees }}
          >
            <Routes>
              <Route path="/review" element={<TransferReview />} />
            </Routes>
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
    )

    expect(screen.getByText('Custom fee')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('fee-type-panel')).getByText('£50.00')
    ).toBeInTheDocument()
  })

  it(`displays ${FeeType.NO_FEE} info properly`, () => {
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

    const fees: ContextValue['fees'] = {
      type: FeeType.NO_FEE,
    }

    render(
      <MemoryRouter initialEntries={['/review']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant, toCourse, fees }}
          >
            <Routes>
              <Route path="/review" element={<TransferReview />} />
            </Routes>
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
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
        return fromValue({
          error: new CombinedError({
            networkError: Error('something went wrong!'),
          }),
        })
      },
    } as unknown as Client

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: addDays(new Date(), 40).toISOString(),
      end: addDays(new Date(), 40).toISOString(),
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

    const fees: ContextValue['fees'] = {
      type: FeeType.APPLY_TERMS,
    }

    render(
      <MemoryRouter initialEntries={['/transfer/review']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant, toCourse, fees }}
          >
            <Routes>
              <Route path="/transfer/review" element={<TransferReview />} />
            </Routes>
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText(/confirm transfer/i))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"There was an error transferring the participant"`
      )
    })
  })

  it('transfers the participant and navigates to the course details page with the success query param', async () => {
    const TO_COURSE_ID = 2
    const FROM_COURSE_ID = 1
    const PARTICIPANT_ID = 'participant-id'
    const CHOSEN_FEE_TYPE = FeeType.APPLY_TERMS

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
            courseId: TO_COURSE_ID,
            participantId: PARTICIPANT_ID,
            auditInput: {
              payload: {
                fromCourse: {
                  id: FROM_COURSE_ID,
                },
                toCourse: {
                  id: TO_COURSE_ID,
                },
                type: CHOSEN_FEE_TYPE,
                percentage: 0,
              },
            },
          } as TransferParticipantMutationVariables,
        })

        if (mutationMatches({ query, variables })) {
          return fromValue<{ data: TransferParticipantMutation }>({
            data: {
              update_course_participant_by_pk: {
                id: PARTICIPANT_ID,
              },
            },
          })
        } else {
          return fromValue({
            error: new CombinedError({
              networkError: Error('something went wrong!'),
            }),
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

    const fees: ContextValue['fees'] = {
      type: FeeType.APPLY_TERMS,
    }

    const CourseDetailsMock = () => {
      const [params] = useSearchParams()

      return <p>{params.get('success')}</p>
    }

    render(
      <MemoryRouter initialEntries={['/transfer/review']}>
        <Provider value={client}>
          <TransferParticipantProvider
            initialValue={{ fromCourse, participant, toCourse, fees }}
          >
            <Routes>
              <Route path="/transfer/review" element={<TransferReview />} />
              <Route path="/details" element={<CourseDetailsMock />} />
            </Routes>
          </TransferParticipantProvider>
        </Provider>
      </MemoryRouter>
    )

    userEvent.click(screen.getByText(/confirm transfer/i))

    await waitFor(() => {
      expect(screen.getByText('participant_transferred')).toBeInTheDocument()
    })
  })
})
