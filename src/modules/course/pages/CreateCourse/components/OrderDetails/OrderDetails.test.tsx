import { addHours } from 'date-fns'
import { DocumentNode } from 'graphql'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Level_Enum,
  Accreditors_Enum,
  CoursePriceQuery,
  GetBildStrategiesQuery,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { COURSE_PRICE_QUERY } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { QUERY as BILD_STRATEGIES_QUERY } from '@app/modules/course/queries/get-bild-strategies'
import { AwsRegions, BildStrategies, ValidCourseInput } from '@app/types'

import { chance, render, screen, userEvent, waitFor } from '@test/index'

import { CreateCourseProvider, useCreateCourse } from '../CreateCourseProvider'

import { OrderDetails } from '.'

const CreateCourseContextConsumer: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { invoiceDetails } = useCreateCourse()

  return <>{invoiceDetails?.orgId ? <p>Invoice details are saved!</p> : null}</>
}

vi.mock('@app/components/OrgSelector/UK', () => ({
  OrgSelector: vi.fn(({ onChange }) => {
    return (
      <input
        name="org-selector"
        data-testid="org-selector"
        onChange={() => onChange({ id: 'org-id' })}
      />
    )
  }),
}))

vi.mock('@app/modules/course/hooks/useCourseDraft', () => ({
  useCourseDraft: vi
    .fn()
    .mockReturnValue({ removeDraft: vi.fn(), setDraft: vi.fn() }),
}))

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockResolvedValue(true),
}))

describe('component: OrderDetails', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  it('displays course details, and pricing with trainer expenses for an ICM course', async () => {
    const courseDate = new Date(1, 1, 2023)

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_2,
                type: Course_Type_Enum.Open,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              freeCourseMaterials: 5,
              organization: { id: 'org-id' },
              minParticipants: 10,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Gbp,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 0,
              price: 100,
              includeVAT: true,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost£1,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 10£100.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 5-£50.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total£1,050.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£200.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due GBP£1,250.00"`)
  })

  it('displays course details, and pricing with trainer expenses for a BILD course', async () => {
    const courseDate = new Date(1, 1, 2023)

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === BILD_STRATEGIES_QUERY) {
          return fromValue<{ data: GetBildStrategiesQuery }>({
            data: {
              strategies: [
                {
                  id: chance.guid(),
                  name: BildStrategies.Primary,
                  shortName: 'P',
                  modules: {},
                },
                {
                  id: chance.guid(),
                  name: BildStrategies.Secondary,
                  shortName: 'S',
                  modules: {},
                },
              ],
            },
          })
        }

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [],
            },
          })
        }

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <CreateCourseProvider
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              accreditedBy: Accreditors_Enum.Bild,
              bildStrategies: {
                PRIMARY: true,
                SECONDARY: true,
              },
              maxParticipants: 10,
              freeCourseMaterials: 5,
              organization: { id: 'org-id' },
              minParticipants: 10,
              priceCurrency: Currency.Gbp,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 0,
              price: 200,
              includeVAT: true,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"BILD Certified Course: PS"`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost£2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 10£100.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 5-£50.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total£2,050.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£400.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due GBP£2,450.00"`)
  })

  it('[MCM FF Disabled] displays course details, and pricing with trainer expenses for an ICM course', async () => {
    const courseDate = new Date(1, 1, 2023)

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_2,
                type: Course_Type_Enum.Open,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              freeCourseMaterials: 5,
              organization: { id: 'org-id' },
              minParticipants: 10,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Gbp,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 0,
              price: 100,
              includeVAT: true,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost£1,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 10£100.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 5-£50.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total£1,050.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£200.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due GBP£1,250.00"`)
  })

  it('[MCM FF Disabled] displays course details, and pricing with trainer expenses for a BILD course', async () => {
    const courseDate = new Date(1, 1, 2023)

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === BILD_STRATEGIES_QUERY) {
          return fromValue<{ data: GetBildStrategiesQuery }>({
            data: {
              strategies: [
                {
                  id: chance.guid(),
                  name: BildStrategies.Primary,
                  shortName: 'P',
                  modules: {},
                },
                {
                  id: chance.guid(),
                  name: BildStrategies.Secondary,
                  shortName: 'S',
                  modules: {},
                },
              ],
            },
          })
        }

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [],
            },
          })
        }

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <CreateCourseProvider
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              accreditedBy: Accreditors_Enum.Bild,
              bildStrategies: {
                PRIMARY: true,
                SECONDARY: true,
              },
              maxParticipants: 10,
              freeCourseMaterials: 5,
              organization: { id: 'org-id' },
              minParticipants: 10,
              priceCurrency: Currency.Gbp,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 0,
              price: 200,
              includeVAT: true,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"BILD Certified Course: PS"`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost£2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 10£100.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 5-£50.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total£2,050.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£400.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due GBP£2,450.00"`)
  })

  it("doesn't calculate and display VAT in order details if it was not included", async () => {
    const courseDate = new Date(1, 1, 2023)
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_2,
                type: Course_Type_Enum.Open,
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
          courseType={Course_Type_Enum.Closed}
          initialValue={{
            courseData: {
              maxParticipants: 10,
              freeCourseMaterials: 5,
              organization: { id: 'org-id' },
              minParticipants: 10,
              priceCurrency: Currency.Gbp,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              blendedLearning: false,
              startDateTime: courseDate,
              endDateTime: addHours(courseDate, 8),
              freeSpaces: 0,
              price: 100,
              includeVAT: false,
            } as unknown as ValidCourseInput,
          }}
        >
          <OrderDetails />
        </CreateCourseProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-title-duration').textContent,
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost£1,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 10£100.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 5-£50.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total£1,050.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      '"VAT (0%)£0.00"',
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due GBP£1,050.00"`)
  })

  it('saves invoice details and navigates to order review step when submitted', async () => {
    const courseDate = new Date(1, 1, 2023)
    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_2,
                type: Course_Type_Enum.Open,
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
          courseType={Course_Type_Enum.Open}
          initialValue={{
            courseData: {
              price: 120,
              maxParticipants: 10,
              startDateTime: courseDate,
              priceCurrency: Currency.Gbp,
              endDateTime: addHours(courseDate, 8),
              organization: { id: 'org-id' },
            } as unknown as ValidCourseInput,
          }}
        >
          <Routes>
            <Route path="/order-details" element={<OrderDetails />} />
            <Route
              path="/review-and-confirm"
              element={<CreateCourseContextConsumer />}
            />
          </Routes>
        </CreateCourseProvider>
      </Provider>,
      {},
      { initialEntries: ['/order-details'] },
    )
    await userEvent.type(screen.getByTestId('org-selector'), 'Organization')
    await userEvent.type(screen.getByLabelText('First Name *'), 'John')
    await userEvent.type(screen.getByLabelText('Surname *'), 'Doe')
    await userEvent.type(
      screen.getByLabelText('Email *'),
      'john.doe@example.com',
    )
    await userEvent.type(screen.getByLabelText('Phone *'), '1234567890')

    await userEvent.click(screen.getByText('Review & confirm'))

    await waitFor(() => {
      expect(screen.getByText(/invoice details are saved/i)).toBeInTheDocument()
    })
  })
})
