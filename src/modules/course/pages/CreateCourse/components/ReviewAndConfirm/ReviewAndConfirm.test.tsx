import { addHours } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  CoursePriceQuery,
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import {
  ExpensesInput,
  RoleName,
  TransportMethod,
  ValidCourseInput,
} from '@app/types'
import {
  courseToCourseInput,
  getMandatoryCourseMaterialsCost,
  getTrainerCarCostPerMile,
} from '@app/util'

import { formatCurrency, render, screen, waitFor, within } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildExpensesInput,
  buildTrainerInput,
  buildTrainerInputAssistant,
} from '@test/mock-data-utils'

import { CreateCourseProvider } from '../CreateCourseProvider'

import { ReviewAndConfirm } from '.'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockResolvedValue(true),
}))

const trainers = [buildTrainerInput(), buildTrainerInputAssistant()]
const expenses: Record<string, ExpensesInput> = {}

for (const trainer of trainers) {
  expenses[trainer.profile_id] = buildExpensesInput()
}

describe('component: ReviewAndConfirm', () => {
  beforeEach(() => {
    useFeatureFlagEnabled('mandatory-course-materials-cost')
    useFeatureFlagEnabled('course-residing-country')
  })

  it('renders alert if course is not found', async () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <CreateCourseProvider courseType={Course_Type_Enum.Closed}>
          <ReviewAndConfirm />
        </CreateCourseProvider>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    await waitFor(() => {
      expect(screen.queryByTestId('ReviewAndConfirm-alert')).toBeInTheDocument()
    })

    expect(
      screen.queryByTestId('ReviewAndConfirm-page-content')
    ).not.toBeInTheDocument()
  })

  it('renders course summary if course data is in context', async () => {
    const schedule = buildCourseSchedule({
      overrides: {
        start: new Date(2023, 1, 1).toISOString(),
        end: addHours(new Date(2023, 1, 1), 8).toISOString(),
      },
    })

    const courseData = courseToCourseInput(
      buildCourse({
        overrides: {
          max_participants: 100,
          schedule: [schedule],
          level: Course_Level_Enum.Level_1,
          price: 120,
        },
      })
    ) as ValidCourseInput

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_2,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 120,
                    priceCurrency: 'GBP',
                  },
                ],
              },
            ],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <CreateCourseProvider
          initialValue={{ courseData, expenses, trainers }}
          courseType={Course_Type_Enum.Closed}
        >
          <ReviewAndConfirm />
        </CreateCourseProvider>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    expect(
      screen.getByTestId('course-title-duration').textContent
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-dates').textContent
    ).toMatchInlineSnapshot(
      `"1 February 2023, 12:00 AM (GMT+00:00) - 1 February 2023, 08:00 AM (GMT+00:00) Europe/London "`
    )

    expect(
      within(screen.getByTestId('sales-row')).getByText(
        courseData.salesRepresentative.fullName as string
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('account-code-row')).getByText(
        courseData.accountCode
      )
    ).toBeInTheDocument()
  })

  it('displays course costs correctly', () => {
    const PRICING_PER_PARTICIPANT = 100
    const NUM_OF_PARTICIPANTS = 10
    const schedule = buildCourseSchedule({
      overrides: {
        start: new Date(2023, 1, 1).toISOString(),
        end: addHours(new Date(2023, 1, 1), 8).toISOString(),
      },
    })

    const leadTrainer = buildTrainerInput()
    const assistantTrainer = buildTrainerInputAssistant()

    const courseData = courseToCourseInput(
      buildCourse({
        overrides: {
          max_participants: NUM_OF_PARTICIPANTS,
          schedule: [schedule],
          level: Course_Level_Enum.Level_1,
          freeSpaces: 0,
          residingCountry: 'GB-ENG',
          includeVAT: true,
        },
      })
    ) as ValidCourseInput

    const leadTrainerExpenses = buildExpensesInput({
      overrides: {
        transport: [
          {
            method: TransportMethod.CAR,
            value: 50,
            accommodationCost: 50,
            accommodationNights: 1,
          },
        ],
        miscellaneous: [{ name: 'Misc', value: 100 }],
      },
    })

    const assistantTrainerExpenses = buildExpensesInput({
      overrides: {
        transport: [
          { method: TransportMethod.FLIGHTS, value: 250, flightDays: 1 },
        ],
        miscellaneous: [{ name: 'Misc', value: 150 }],
      },
    })

    const expenses = {
      [leadTrainer.profile_id]: leadTrainerExpenses,
      [assistantTrainer.profile_id]: assistantTrainerExpenses,
    }

    const trainers = [leadTrainer, assistantTrainer]

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_2,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 120,
                    priceCurrency: 'GBP',
                  },
                ],
              },
            ],
          },
        }),
    } as unknown as Client

    const trainerExpenses = 610
    const freeSpacesDiscount = PRICING_PER_PARTICIPANT * courseData.freeSpaces
    const coursePricing = courseData.price * courseData.maxParticipants
    const mandatoryCourseCost = getMandatoryCourseMaterialsCost(
      courseData.mandatoryCourseMaterials ?? 0,
      Currency.Gbp
    )
    const subtotal =
      trainerExpenses + coursePricing + mandatoryCourseCost - freeSpacesDiscount
    const vat = 1.2

    render(
      <Provider value={client}>
        <CreateCourseProvider
          initialValue={{
            courseData,
            expenses,
            trainers,
          }}
          courseType={Course_Type_Enum.Closed}
        >
          <ReviewAndConfirm />
        </CreateCourseProvider>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } }
    )

    const leadTrainerRow = screen.getByTestId(
      `trainer-${leadTrainer.profile_id}-row`
    )
    const leadTrainerTrip = screen.getByTestId(`${leadTrainer.fullName}-trip-0`)
    const leadTrainerAccommodationCostsRow = screen.getByTestId(
      `${leadTrainer.fullName}-accommodation-costs`
    )
    const leadTrainerAccommodationNights = screen.getByTestId(
      `${leadTrainer.fullName}-accommodation-nights`
    )

    expect(
      within(leadTrainerRow).getByText(leadTrainer?.fullName ?? '')
    ).toBeInTheDocument()

    expect(within(leadTrainerTrip).getByText(/car/i)).toBeInTheDocument()
    expect(
      within(leadTrainerTrip).getByText(
        formatCurrency(
          getTrainerCarCostPerMile(leadTrainerExpenses.transport[0].value)
        )
      )
    ).toBeInTheDocument()

    expect(
      within(leadTrainerTrip).getByText(
        `${leadTrainerExpenses.transport[0].value} miles`
      )
    ).toBeInTheDocument()

    expect(
      within(leadTrainerRow).getByText(/accommodation/i)
    ).toBeInTheDocument()

    expect(
      within(leadTrainerAccommodationCostsRow).getByText(/accommodation/i)
    ).toBeInTheDocument()
    expect(
      within(leadTrainerAccommodationCostsRow).getByText(formatCurrency(50))
    ).toBeInTheDocument()

    expect(
      within(leadTrainerAccommodationNights).getByText(/1 night/i)
    ).toBeInTheDocument()

    const assistantTrainerTrip = screen.getByTestId(
      `${assistantTrainer.fullName}-trip-0`
    )

    const assistantTrainerMiscRow = screen.getByTestId(
      `${assistantTrainer.fullName}-misc-0`
    )

    expect(
      within(assistantTrainerTrip).getByText(/flights/i)
    ).toBeInTheDocument()

    expect(
      within(assistantTrainerTrip).getByText(formatCurrency(250))
    ).toBeInTheDocument()

    expect(
      within(assistantTrainerTrip).getByText(/1 day of travel/)
    ).toBeInTheDocument()

    expect(
      within(assistantTrainerMiscRow).getByText(/misc/i)
    ).toBeInTheDocument()
    expect(
      within(assistantTrainerMiscRow).getByText(formatCurrency(150))
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('trainer-total-expenses')).getByText(
        /trainer expenses total/i
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('trainer-total-expenses')).getByText(
        formatCurrency(trainerExpenses)
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('course-price-row')).getByText(
        formatCurrency(courseData.price * courseData.maxParticipants)
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('mandatory-course-materials-row')).getByText(
        formatCurrency(mandatoryCourseCost)
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('free-course-materials-row')).getByText(
        formatCurrency(0)
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('free-spaces-row')).getByText(
        `-${formatCurrency(courseData.freeSpaces * PRICING_PER_PARTICIPANT)}`
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('subtotal-row')).getByText(
        formatCurrency(subtotal)
      )
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('total-costs-row')).getByText(
        formatCurrency(subtotal * vat)
      )
    ).toBeInTheDocument()
  })
})
