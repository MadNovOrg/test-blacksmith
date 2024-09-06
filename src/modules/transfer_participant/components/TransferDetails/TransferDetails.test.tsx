import { addDays } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { UKsCodes } from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  CourseDeliveryType,
  CourseLevel,
  CourseType,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  TransferFeeType,
} from '@app/generated/graphql'
import useTimeZones from '@app/hooks/useTimeZones'

import {
  render,
  renderHook,
  screen,
  userEvent,
  waitFor,
  within,
} from '@test/index'

import { EligibleCourse } from '../../utils/types'
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

  const {
    result: {
      current: { formatGMTDateTimeByTimeZone },
    },
  } = renderHook(() => useTimeZones())

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
            <Route path="/details" element={<TransferDetails />} />
            <Route path="/" element={<p>First step</p>} />
          </Routes>
        </TransferParticipantProvider>
      </Provider>,
      {},
      { initialEntries: ['/details'] },
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    await userEvent.click(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.back-btn-label'),
      ),
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    await userEvent.click(
      screen.getByLabelText(
        t('pages.transfer-participant.transfer-details.apply-terms-option'),
      ),
    )

    expect(screen.getByTestId('transfer-terms-table')).toBeInTheDocument()

    const transferReasonField = screen.getByTestId('reasonForTransfer-input')
    await userEvent.type(transferReasonField, 'Why not?')

    await userEvent.click(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.next-btn-label'),
      ),
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    await userEvent.click(
      screen.getByLabelText(
        t('pages.transfer-participant.review-transfer.custom-fee'),
      ),
    )
    await userEvent.type(
      screen.getByLabelText(t('components.fees-form.custom-fee-label')),
      '50',
    )

    const transferReasonField = screen.getByTestId('reasonForTransfer-input')
    await userEvent.type(transferReasonField, 'Why not?')

    expect(screen.queryByTestId('transfer-terms-table')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.next-btn-label'),
      ),
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    await userEvent.click(
      screen.getByLabelText(
        t('pages.transfer-participant.review-transfer.custom-fee'),
      ),
    )

    expect(
      screen.getByText(
        t('pages.transfer-participant.transfer-details.next-btn-label'),
      ),
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    await waitFor(() => {
      expect(
        screen.queryByLabelText(
          t('pages.transfer-participant.transfer-details.apply-terms-option'),
        ),
      ).not.toBeInTheDocument()

      expect(
        screen.queryByLabelText(
          t('pages.transfer-participant.review-transfer.custom-fee'),
        ),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByLabelText(t('components.fees-form.no-fee-option')),
      ).not.toBeInTheDocument()

      expect(screen.getByTestId('transfer-terms-table')).toBeInTheDocument()
    })
  })

  it(`displays correct course timezone`, async () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
    } as unknown as Client

    const toCourseTimezone = 'Europe/Bucharest'

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      end: addDays(new Date(), 1).toISOString(),
      type: Course_Type_Enum.Open,
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      freeSlots: 2,
      reaccreditation: false,
      courseResidingCountry: 'RO',
      timezone: toCourseTimezone,
      deliveryType: CourseDeliveryType.F2F,
      type: CourseType.Open,
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    expect(
      screen.getByTestId('order-course-duration').textContent,
    ).toMatchInlineSnapshot(
      `"${t('dates.defaultShort', { date: toCourse.startDate })}${t(
        'pages.course-participants.course-beggins',
      )} ${t('dates.time', {
        date: utcToZonedTime(toCourse.startDate, toCourseTimezone),
      })} ${formatGMTDateTimeByTimeZone(
        toCourse.startDate,
        toCourseTimezone,
        true,
      )}${t('pages.course-participants.course-ends')} ${t('dates.time', {
        date: utcToZonedTime(toCourse.endDate, toCourseTimezone),
      })} ${formatGMTDateTimeByTimeZone(
        toCourse.endDate,
        toCourseTimezone,
        true,
      )}"`,
    )
  })

  it(`displays default England/London timezone`, async () => {
    const client = {
      executeQuery: () =>
        fromValue({
          data: {
            course: null,
            participant: null,
          },
        }),
    } as unknown as Client

    const defaultTimeZone = 'Europe/London'

    const fromCourse: FromCourse = {
      id: 1,
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      end: addDays(new Date(), 1).toISOString(),
      type: Course_Type_Enum.Open,
      deliveryType: Course_Delivery_Type_Enum.F2F,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    expect(
      screen.getByTestId('order-course-duration').textContent,
    ).toMatchInlineSnapshot(
      `"${t('dates.defaultShort', { date: toCourse.startDate })}${t(
        'pages.course-participants.course-beggins',
      )} ${t('dates.time', {
        date: utcToZonedTime(toCourse.startDate, defaultTimeZone),
      })} ${formatGMTDateTimeByTimeZone(
        toCourse.startDate,
        defaultTimeZone,
        true,
      )}${t('pages.course-participants.course-ends')} ${t('dates.time', {
        date: utcToZonedTime(toCourse.endDate, defaultTimeZone),
      })} ${formatGMTDateTimeByTimeZone(
        toCourse.endDate,
        defaultTimeZone,
        true,
      )}"`,
    )
  })

  it(`display postal address fields when transfer to UK Virtual course`, async () => {
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
      end: addDays(new Date(), 1).toISOString(),
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      type: Course_Type_Enum.Open,
      residingCountry: UKsCodes.GB_ENG,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      deliveryType: CourseDeliveryType.Virtual,
      endDate: new Date().toISOString(),
      freeSlots: 2,
      level: CourseLevel.Level_1,
      reaccreditation: false,
      startDate: new Date().toISOString(),
      type: CourseType.Open,
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
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
          participantId={participant.id}
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    expect(
      screen.getByLabelText(t('line1'), { exact: false }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(t('line2'))).toBeInTheDocument()

    expect(
      screen.getByLabelText(t('city'), { exact: false }),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(
        t('components.venue-selector.modal.fields.postCode'),
        { exact: false },
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(t('residing-country'), { exact: false }),
    ).toBeInTheDocument()
  })

  it(`enable review and confirm button when transfer to UK Virtual course on all fields filled`, async () => {
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
      end: addDays(new Date(), 1).toISOString(),
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      type: Course_Type_Enum.Open,
      residingCountry: UKsCodes.GB_ENG,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      deliveryType: CourseDeliveryType.Virtual,
      endDate: new Date().toISOString(),
      freeSlots: 2,
      level: CourseLevel.Level_1,
      reaccreditation: false,
      startDate: new Date().toISOString(),
      type: CourseType.Open,
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
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
          participantId={participant.id}
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    const noFeeCheckbox = screen.getByLabelText(
      t('components.fees-form.no-fee-option'),
    )
    await userEvent.click(noFeeCheckbox)

    const reason = screen.getByLabelText(
      t('pages.edit-course.transfer.reason-for-transfer'),
      { exact: false },
    )
    await userEvent.type(reason, 'Reason')

    const line1 = screen.getByLabelText(t('line1'), { exact: false })
    expect(line1).toBeInTheDocument()
    await userEvent.type(line1, 'Line 1')

    const line2 = screen.getByLabelText(t('line2'))
    expect(line2).toBeInTheDocument()

    const city = screen.getByLabelText(t('city'), { exact: false })
    expect(city).toBeInTheDocument()
    await userEvent.type(city, 'City')

    const postCode = screen.getByLabelText(
      t('components.venue-selector.modal.fields.postCode'),
      { exact: false },
    )
    expect(postCode).toBeInTheDocument()
    await userEvent.type(postCode, 'WC2N 5DU')

    const countriesSelector = screen.getByTestId(
      'countries-selector-autocomplete',
    )
    expect(countriesSelector).toBeInTheDocument()
    countriesSelector.focus()

    const textField = within(countriesSelector).getByTestId(
      'countries-selector-input',
    )
    expect(textField).toBeInTheDocument()
    await userEvent.type(textField, 'England')

    const countryInUK = screen.getByTestId('country-GB-ENG')
    expect(countryInUK).toBeInTheDocument()
    await userEvent.click(countryInUK)

    const reviewAndConfirmBtn = screen.getByTestId('review-and-confirm')
    expect(reviewAndConfirmBtn).toBeEnabled()
  })

  it(`allows only uk countries in the country selector when transfering to a VIRTUAL `, async () => {
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
      end: addDays(new Date(), 1).toISOString(),
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      type: Course_Type_Enum.Open,
      residingCountry: UKsCodes.GB_ENG,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      deliveryType: CourseDeliveryType.Virtual,
      endDate: new Date().toISOString(),
      freeSlots: 2,
      level: CourseLevel.Level_1,
      reaccreditation: false,
      startDate: new Date().toISOString(),
      type: CourseType.Open,
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
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
          participantId={participant.id}
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )
    const countriesSelector = screen.getByTestId(
      'countries-selector-autocomplete',
    )
    expect(countriesSelector).toBeInTheDocument()
    countriesSelector.focus()

    const textField = within(countriesSelector).getByTestId(
      'countries-selector-input',
    )
    expect(textField).toBeInTheDocument()

    await userEvent.type(textField, 'England')
    expect(screen.queryByTestId('country-GB-ENG')).toBeInTheDocument()
    await userEvent.clear(within(textField).getByRole('combobox'))

    await userEvent.type(textField, 'Romania')
    expect(screen.queryByTestId('country-RO')).not.toBeInTheDocument()
    await userEvent.clear(within(textField).getByRole('combobox'))

    await userEvent.type(textField, 'wales')
    expect(screen.queryByTestId('country-GB-WLS')).toBeInTheDocument()
  })

  it(`disable review and confirm button when transfer to UK Virtual course if postal address fields are not filled`, async () => {
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
      end: addDays(new Date(), 1).toISOString(),
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      type: Course_Type_Enum.Open,
      residingCountry: UKsCodes.GB_ENG,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      deliveryType: CourseDeliveryType.Virtual,
      endDate: new Date().toISOString(),
      freeSlots: 2,
      level: CourseLevel.Level_1,
      reaccreditation: false,
      startDate: new Date().toISOString(),
      type: CourseType.Open,
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
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
          participantId={participant.id}
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    const noFeeCheckbox = screen.getByLabelText(
      t('components.fees-form.no-fee-option'),
    )
    await userEvent.click(noFeeCheckbox)

    const reason = screen.getByLabelText(
      t('pages.edit-course.transfer.reason-for-transfer'),
      { exact: false },
    )
    await userEvent.type(reason, 'Reason')

    const line1 = screen.getByLabelText(t('line1'), { exact: false })
    expect(line1).toBeInTheDocument()

    const line2 = screen.getByLabelText(t('line2'))
    expect(line2).toBeInTheDocument()

    const city = screen.getByLabelText(t('city'), { exact: false })
    expect(city).toBeInTheDocument()

    const postCode = screen.getByLabelText(
      t('components.venue-selector.modal.fields.postCode'),
      { exact: false },
    )
    expect(postCode).toBeInTheDocument()

    const countriesSelector = screen.getByTestId(
      'countries-selector-autocomplete',
    )
    expect(countriesSelector).toBeInTheDocument()
    countriesSelector.focus()

    const textField = within(countriesSelector).getByTestId(
      'countries-selector-input',
    )
    expect(textField).toBeInTheDocument()

    const reviewAndConfirmBtn = screen.getByTestId('review-and-confirm')
    expect(reviewAndConfirmBtn).toBeDisabled()
  })

  it(`enable review and confirm button when transfer to UK F2F course`, async () => {
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
      end: addDays(new Date(), 1).toISOString(),
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      type: Course_Type_Enum.Open,
      residingCountry: UKsCodes.GB_ENG,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      deliveryType: CourseDeliveryType.F2F,
      endDate: new Date().toISOString(),
      freeSlots: 2,
      level: CourseLevel.Level_1,
      reaccreditation: false,
      startDate: new Date().toISOString(),
      type: CourseType.Open,
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
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
          participantId={participant.id}
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    const noFeeCheckbox = screen.getByLabelText(
      t('components.fees-form.no-fee-option'),
    )
    await userEvent.click(noFeeCheckbox)

    const reason = screen.getByLabelText(
      t('pages.edit-course.transfer.reason-for-transfer'),
      { exact: false },
    )
    await userEvent.type(reason, 'Reason')

    const reviewAndConfirmBtn = screen.getByTestId('review-and-confirm')
    expect(reviewAndConfirmBtn).toBeEnabled()
  })

  it(`do not display postal address fields when transfer to UK F2F course`, async () => {
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
      deliveryType: Course_Delivery_Type_Enum.F2F,
      end: addDays(new Date(), 1).toISOString(),
      level: Course_Level_Enum.Level_1,
      start: new Date().toISOString(),
      type: Course_Type_Enum.Open,
      residingCountry: UKsCodes.GB_ENG,
    }

    const toCourse: EligibleCourse = {
      id: 2,
      courseCode: 'course-code',
      deliveryType: CourseDeliveryType.F2F,
      endDate: new Date().toISOString(),
      freeSlots: 2,
      level: CourseLevel.Level_1,
      reaccreditation: false,
      startDate: new Date().toISOString(),
      type: CourseType.Open,
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
          courseId={fromCourse.id}
          initialValue={{ fromCourse, participant, toCourse }}
          participantId={participant.id}
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
      { initialEntries: ['/transfer/participant-id/details'] },
    )

    expect(
      screen.queryByLabelText(t('line1'), { exact: false }),
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(t('line2'))).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('city'), { exact: false }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(
        t('components.venue-selector.modal.fields.postCode'),
        { exact: false },
      ),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('residing-country'), { exact: false }),
    ).not.toBeInTheDocument()
  })
})
