import { add } from 'date-fns'
import React from 'react'
import useSWR from 'swr'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import {
  CourseType,
  Currency,
  ExpensesInput,
  RoleName,
  TransportMethod,
  ValidCourseInput,
} from '@app/types'
import { courseToCourseInput, roundToTwoDecimals } from '@app/util'

import { render, screen, within, waitFor } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildExpensesInput,
  buildTrainerInput,
  buildTrainerInputAssistant,
} from '@test/mock-data-utils'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { ReviewAndConfirm } from '.'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('swr')
const mockSWR = jest.mocked(useSWR)

const formatCurrency = (v: number): string => {
  const [integer, decimal] = roundToTwoDecimals(v).toFixed(2).split('.')

  let result = ''
  for (let i = integer.length - 1; i >= 0; --i) {
    const c = integer[i]
    if ((integer.length - i - 1) % 3 === 0 && integer.length - i - 1 > 0) {
      result = `,${result}`
    }

    result = `${c}${result}`
  }

  return `£${result}.${decimal}`
}

const schedule = buildCourseSchedule({
  overrides: {
    end: add(new Date(), { hours: 8 }).toISOString(),
  },
})

const overrides = {
  trainers: [],
  max_participants: 11,
  schedule: [schedule],
  freeSpaces: 2,
}

const courseData = courseToCourseInput(
  buildCourse({ overrides })
) as ValidCourseInput
const trainers = [buildTrainerInput(), buildTrainerInputAssistant()]
const expenses: Record<string, ExpensesInput> = {}

for (const trainer of trainers) {
  expenses[trainer.profile_id] = buildExpensesInput()
}

describe('component: ReviewAndConfirm', () => {
  it('renders alert if course is not found', async () => {
    render(
      <CreateCourseProvider courseType={CourseType.CLOSED}>
        <ReviewAndConfirm />
      </CreateCourseProvider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    await waitFor(() => {
      expect(screen.queryByTestId('ReviewAndConfirm-alert')).toBeInTheDocument()
    })

    expect(
      screen.queryByTestId('ReviewAndConfirm-page-content')
    ).not.toBeInTheDocument()
  })

  it('renders alert if pricing info could not be fetched', async () => {
    mockSWR.mockReturnValue({
      error: new Error(),
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <CreateCourseProvider
        initialValue={{ courseData, expenses, trainers }}
        courseType={CourseType.CLOSED}
      >
        <ReviewAndConfirm />
      </CreateCourseProvider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('ReviewAndConfirm-alert-pricing')
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByTestId('ReviewAndConfirm-page-content')
    ).not.toBeInTheDocument()
  })

  it('renders course summary if course data is in context', async () => {
    mockSWR.mockReturnValue({
      data: {
        coursePricing: [
          {
            id: '',
            level: Course_Level_Enum.Level_1,
            type: Course_Type_Enum.Closed,
            blended: false,
            reaccreditation: false,
            priceAmount: 100,
            priceCurrency: Currency.GBP,
            xeroCode: '',
          },
        ],
      },
      mutate: jest.fn(),
      isValidating: false,
    })

    render(
      <CreateCourseProvider
        initialValue={{ courseData, expenses, trainers }}
        courseType={CourseType.CLOSED}
      >
        <ReviewAndConfirm />
      </CreateCourseProvider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('ReviewAndConfirm-page-content')
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByTestId('ReviewAndConfirm-alert')
    ).not.toBeInTheDocument()

    expect(screen.queryByText(/8 hours/)).toBeInTheDocument()
    expect(
      screen.queryByText(courseData.salesRepresentative.fullName, {
        exact: false,
      })
    ).toBeInTheDocument()
    expect(screen.queryByText(/810A [A-Z][a-z]{2}\d{2}/)).toBeInTheDocument()

    let totalExpenses = 0
    trainers.forEach(t => {
      const { transport, miscellaneous } = expenses[t.profile_id]
      let accommodationNightsTotal = 0

      const trainerData = within(
        screen.getByTestId(`${t.fullName}-trainer-expenses`)
      )

      transport
        .filter(({ method }) => method !== TransportMethod.NONE)
        .forEach(({ method, value, accommodationNights, flightDays }, idx) => {
          expect(value).not.toBeNull()

          const roundValue = roundToTwoDecimals(value as number)

          if (accommodationNights) {
            accommodationNightsTotal += accommodationNights
          }

          const tripData = within(
            trainerData.getByTestId(`${t.fullName}-trip-${idx}`)
          )
          switch (method) {
            case TransportMethod.CAR:
              expect(
                tripData.getByText(`${formatCurrency(0.6 * roundValue)}`, {
                  exact: false,
                })
              ).toBeInTheDocument()
              expect(
                tripData.getByText(`${roundValue} miles`)
              ).toBeInTheDocument()

              totalExpenses += roundToTwoDecimals(0.6 * roundValue)
              break

            case TransportMethod.FLIGHTS:
              expect(flightDays).not.toBeNull()
              expect(
                tripData.getByText(
                  `${flightDays} ${flightDays === 1 ? 'day' : 'days'} of travel`
                )
              ).toBeInTheDocument()
            // FALLS THROUGH
            case TransportMethod.PUBLIC:
            case TransportMethod.PRIVATE:
              expect(
                tripData.getByText(`${roundValue}`, {
                  exact: false,
                })
              ).toBeInTheDocument()

              totalExpenses += roundValue
              break

            default:
              break
          }
        })

      if (accommodationNightsTotal > 0) {
        expect(trainerData.getByText(/Accommodation/)).toBeInTheDocument()
        expect(
          trainerData.getByText(
            `${formatCurrency(30 * accommodationNightsTotal)}`,
            { exact: false }
          )
        ).toBeInTheDocument()
        expect(
          trainerData.getByText(
            `${accommodationNightsTotal} ${
              accommodationNightsTotal > 1 ? 'nights' : 'night'
            }`,
            { exact: false }
          )
        ).toBeInTheDocument()

        totalExpenses += roundToTwoDecimals(30 * accommodationNightsTotal)
      }

      miscellaneous?.forEach(({ name, value }) => {
        expect(name).not.toBeNull()
        expect(value).not.toBeNull()

        const roundValue = roundToTwoDecimals(value as number)

        expect(
          trainerData.getByText(name as string, { exact: false })
        ).toBeInTheDocument()
        expect(
          trainerData.getByText(`${roundValue}`, {
            exact: false,
          })
        ).toBeInTheDocument()

        totalExpenses += roundValue
      })
    })

    expect(screen.getByText(/Trainer expenses total/)).toBeInTheDocument()
    expect(
      screen.getByText(`${formatCurrency(totalExpenses)}`, { exact: false })
    ).toBeInTheDocument()

    expect(screen.getByText(/Attendees? x \d+/)).toBeInTheDocument()
    expect(screen.getByText('£1,100.00', { exact: false })).toBeInTheDocument()

    expect(screen.getByText(/Sub total/)).toBeInTheDocument()
    expect(screen.getByText('£900.00', { exact: false })).toBeInTheDocument()

    expect(screen.getByText(/VAT \(20%\)/)).toBeInTheDocument()
    expect(
      screen.getByText(`${formatCurrency(totalExpenses * 0.2 + 180)}`, {
        exact: false,
      })
    ).toBeInTheDocument()

    expect(screen.getByText(/Amount due \(GBP\)/)).toBeInTheDocument()
    expect(
      screen.getByText(`${formatCurrency(totalExpenses * 1.2 + 1080.0)}`, {
        exact: false,
      })
    ).toBeInTheDocument()
  })
})
