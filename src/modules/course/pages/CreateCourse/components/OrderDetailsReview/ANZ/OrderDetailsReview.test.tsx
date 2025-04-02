import { addHours, addYears } from 'date-fns'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Level_Enum,
  CoursePriceQuery,
  Course_Type_Enum,
  Currency,
  Course_Trainer_Type_Enum,
  CourseLevel,
} from '@app/generated/graphql'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import {
  AwsRegions,
  ExpensesInput,
  TrainerRoleTypeName,
  TransportMethod,
  ValidCourseInput,
} from '@app/types'

import { chance, render, screen, waitFor } from '@test/index'

import { CreateCourseProvider } from '../../CreateCourseProvider'

import { OrderDetailsReview } from '.'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockReturnValue(false),
}))

vi.mock('@app/modules/resource_packs/hooks/useResourcePackPricing')
const useResourcePackPricingMocked = vi.mocked(useResourcePackPricing)

describe('component: OrderDetailsReview', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })
  const courseDate = new Date()

  it('displays course details, with pricing and resource packs, Aud Currency and GST included', async () => {
    useResourcePackPricingMocked.mockReturnValue({
      data: {
        resource_packs_pricing: [
          {
            id: chance.guid(),
            AUD_price: 52,
            NZD_price: 57,
          },
        ],
      },
      fetching: false,
      error: undefined,
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 100,
                    priceCurrency: Currency.Aud,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Aud,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 5,
              price: 100,
              includeVAT: true,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetailsReview />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"Behaviour Support Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course CostA$2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Resource Pack x 20A$1,040.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Resource Pack x 10-A$520.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub totalA$2,020.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"GST (10%)A$202.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due AUDA$2,222.00"`)
  })

  it('displays course details, with pricing and resource packs, Aud Currency and GST excluded', async () => {
    useResourcePackPricingMocked.mockReturnValue({
      data: {
        resource_packs_pricing: [
          {
            id: chance.guid(),
            AUD_price: 52,
            NZD_price: 57,
          },
        ],
      },
      fetching: false,
      error: undefined,
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 100,
                    priceCurrency: Currency.Aud,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              residingCountry: 'FJ',
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Aud,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 5,
              price: 100,
              includeVAT: false,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetailsReview />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"Behaviour Support Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course CostA$2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Resource Pack x 20A$1,040.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Resource Pack x 10-A$520.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub totalA$2,020.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"GST (0%)A$0.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due AUDA$2,020.00"`)
  })

  it('displays course details, with pricing and resource packs, Nzd Currency and GST included', async () => {
    useResourcePackPricingMocked.mockReturnValue({
      data: {
        resource_packs_pricing: [
          {
            id: chance.guid(),
            AUD_price: 52,
            NZD_price: 57,
          },
        ],
      },
      fetching: false,
      error: undefined,
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 100,
                    priceCurrency: Currency.Nzd,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              residingCountry: 'NZ',
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Nzd,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 5,
              price: 100,
              includeVAT: true,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetailsReview />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"Behaviour Support Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course CostNZ$2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Resource Pack x 20NZ$1,140.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Resource Pack x 10-NZ$570.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub totalNZ$2,070.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"GST (10%)NZ$207.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due NZDNZ$2,277.00"`)
  })

  it('displays course details, with pricing and resource packs, Nzd Currency and GST excluded', async () => {
    useResourcePackPricingMocked.mockReturnValue({
      data: {
        resource_packs_pricing: [
          {
            id: chance.guid(),
            AUD_price: 52,
            NZD_price: 57,
          },
        ],
      },
      fetching: false,
      error: undefined,
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 100,
                    priceCurrency: Currency.Nzd,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              residingCountry: 'WS',
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Nzd,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 5,
              price: 100,
              includeVAT: false,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetailsReview />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"Behaviour Support Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course CostNZ$2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Resource Pack x 20NZ$1,140.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Resource Pack x 10-NZ$570.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub totalNZ$2,070.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"GST (0%)NZ$0.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due NZDNZ$2,070.00"`)
  })

  it('displays correct transportation cost for car on ANZ for AUD$ currency', async () => {
    const trainerFullName = 'Five Trainer'
    const trainerProfileId = chance.guid()
    useResourcePackPricingMocked.mockReturnValue({
      data: {
        resource_packs_pricing: [
          {
            id: chance.guid(),
            AUD_price: 52,
            NZD_price: 57,
          },
        ],
      },
      fetching: false,
      error: undefined,
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 100,
                    priceCurrency: Currency.Aud,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              residingCountry: 'NZ',
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Aud,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 5,
              price: 100,
              includeVAT: false,
              type: Course_Type_Enum.Closed,
            } as unknown as ValidCourseInput,
            expenses: {
              [trainerProfileId]: {
                transport: [
                  {
                    method: TransportMethod.CAR,
                    value: 300, // milage
                  },
                ],
              },
            } as Record<string, ExpensesInput>,
            trainers: [
              {
                profile_id: trainerProfileId,
                fullName: trainerFullName,
                levels: [
                  {
                    courseLevel: CourseLevel.AdvancedTrainer,
                    expiryDate: addYears(new Date(), 2).toISOString(),
                  },
                ],
                type: Course_Trainer_Type_Enum.Leader,
                trainer_role_types: [
                  {
                    trainer_role_type: {
                      name: TrainerRoleTypeName.PRINCIPAL,
                    },
                  },
                ],
              },
            ],
          }}
        >
          <OrderDetailsReview />
        </CreateCourseProvider>
      </Provider>,
    )

    const trainerExpensesSection = screen.getByTestId(
      `trainer-${trainerProfileId}-row`,
    )
    expect(trainerExpensesSection).toBeInTheDocument()

    await waitFor(() => {
      const carCostRow = screen.getByTestId(`${trainerFullName}-trip-${0}`) // first expense row for trainer
      expect(carCostRow).toBeInTheDocument()
      expect(carCostRow.textContent).toMatchInlineSnapshot(
        `"CarA$125.00300 miles"`,
      )
    })
  })

  it('displays correct transportation cost for car on ANZ for NZD$ currency', async () => {
    const trainerFullName = 'Five Trainer'
    const trainerProfileId = chance.guid()
    useResourcePackPricingMocked.mockReturnValue({
      data: {
        resource_packs_pricing: [
          {
            id: chance.guid(),
            AUD_price: 52,
            NZD_price: 57,
          },
        ],
      },
      fetching: false,
      error: undefined,
    })
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Closed,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 100,
                    priceCurrency: Currency.Nzd,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              residingCountry: 'NZ',
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Nzd,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 5,
              price: 100,
              includeVAT: false,
              type: Course_Type_Enum.Closed,
            } as unknown as ValidCourseInput,
            expenses: {
              [trainerProfileId]: {
                transport: [
                  {
                    method: TransportMethod.CAR,
                    value: 300, // milage
                  },
                ],
              },
            } as Record<string, ExpensesInput>,
            trainers: [
              {
                profile_id: trainerProfileId,
                fullName: trainerFullName,
                levels: [
                  {
                    courseLevel: CourseLevel.AdvancedTrainer,
                    expiryDate: addYears(new Date(), 2).toISOString(),
                  },
                ],
                type: Course_Trainer_Type_Enum.Leader,
                trainer_role_types: [
                  {
                    trainer_role_type: {
                      name: TrainerRoleTypeName.PRINCIPAL,
                    },
                  },
                ],
              },
            ],
          }}
        >
          <OrderDetailsReview />
        </CreateCourseProvider>
      </Provider>,
    )

    const trainerExpensesSection = screen.getByTestId(
      `trainer-${trainerProfileId}-row`,
    )
    expect(trainerExpensesSection).toBeInTheDocument()

    await waitFor(() => {
      const carCostRow = screen.getByTestId(`${trainerFullName}-trip-${0}`) // first expense row for trainer
      expect(carCostRow).toBeInTheDocument()
      expect(carCostRow.textContent).toMatchInlineSnapshot(
        `"CarNZ$137.00300 miles"`,
      )
    })
  })
})
