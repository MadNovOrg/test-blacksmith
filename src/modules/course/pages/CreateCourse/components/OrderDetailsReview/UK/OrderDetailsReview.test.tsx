import { addHours } from 'date-fns'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Level_Enum,
  CoursePriceQuery,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { AwsRegions, ValidCourseInput } from '@app/types'

import { render, screen } from '@test/index'

import { CreateCourseProvider } from '../../CreateCourseProvider'

import { OrderDetailsReview } from '.'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockReturnValue(false),
}))

describe('component: OrderDetailsReview', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  const courseDate = new Date()

  it('displays course details, with pricing and resource packs, GBP Currency and VAT included', async () => {
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
                    priceCurrency: Currency.Gbp,
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
              priceCurrency: Currency.Gbp,
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
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost£2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 20£200.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 10-£100.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total£1,600.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£300.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due GBP£1,900.00"`)
  })

  it('displays course details, with pricing and resource packs, GBP Currency and VAT excluded', async () => {
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
                    priceCurrency: Currency.Gbp,
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
              priceCurrency: Currency.Gbp,
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
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost£2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 20£200.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 10-£100.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total£1,600.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (0%)£0.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due GBP£1,600.00"`)
  })

  it('displays course details, with pricing and resource packs, EUR Currency and VAT included', async () => {
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
                    priceCurrency: Currency.Eur,
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
              residingCountry: 'FR',
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Eur,
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
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost€2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 20€240.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 10-€120.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total€1,620.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)€300.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due EUR€1,920.00"`)
  })

  it('displays course details, with pricing and resource packs, EUR Currency and VAT excluded', async () => {
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
                    priceCurrency: Currency.Eur,
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
              residingCountry: 'RO',
              maxParticipants: 20,
              freeCourseMaterials: 10,
              organization: { id: 'org-id' },
              minParticipants: 0,
              courseLevel: Course_Level_Enum.Level_1,
              reaccreditation: false,
              priceCurrency: Currency.Eur,
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
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One "`)

    expect(
      screen.getByTestId('course-price-row').textContent,
    ).toMatchInlineSnapshot(`"Course Cost€2,000.00"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 20€240.00"`)

    expect(
      screen.getByTestId('free-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Free Course Materials x 10-€120.00"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Sub total€1,620.00"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (0%)€0.00"`,
    )

    expect(
      screen.getByTestId('total-costs-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due EUR€1,620.00"`)
  })
})
