// TODO: Refactor these tests to use calculated values instead of hardcoded ones
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Provider, Client, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
  GetCoursePricingQuery,
  GetTempProfileQuery,
} from '@app/generated/graphql'
import { GET_COURSE_PRICING_QUERY } from '@app/modules/course_booking/queries/get-course-pricing'
import { GET_TEMP_PROFILE } from '@app/modules/course_booking/queries/get-temp-profile'
import { AwsRegions } from '@app/types'

import { render, screen } from '@test/index'

import { BookingProvider } from '../../BookingContext'

import { CourseBookingReview } from '.'

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

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMocked = vi.mocked(useFeatureFlagEnabled)

describe('component: BookingDetailsReview', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })

  it('displays the order details', async () => {
    useFeatureFlagEnabledMocked.mockReturnValue(false)
    const client = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSE_PRICING_QUERY) {
          return fromValue<{ data: GetCoursePricingQuery }>({
            data: {
              pricing: {
                priceAmount: 120,
                priceCurrency: Currency.Gbp,
                xeroCode: '',
              },
            },
          })
        }
        if (query === GET_TEMP_PROFILE) {
          return fromValue<{ data: GetTempProfileQuery }>({
            data: {
              tempProfiles: [
                {
                  __typename: 'profile_temp',
                  quantity: 1,
                  course: {
                    __typename: 'course',
                    id: 101,
                    name: 'Positive Behaviour Training: Level One',
                    accreditedBy: Accreditors_Enum.Icm,
                    price: null,
                    priceCurrency: Currency.Gbp,
                    type: Course_Type_Enum.Open,
                    deliveryType: Course_Delivery_Type_Enum.F2F,
                    level: Course_Level_Enum.Level_1,
                    reaccreditation: true,
                    conversion: false,
                    freeSpaces: 0,
                    residingCountry: 'GB-ENG',
                    includeVAT: true,
                    courseCode: 'AP101',
                    maxParticipants: 20,
                    dates: {
                      __typename: 'course_schedule_aggregate',
                      aggregate: {
                        __typename: 'course_schedule_aggregate_fields',
                        start: {
                          __typename: 'course_schedule_min_fields',
                          date: '2024-01-15T09:00:00Z',
                        },
                        end: {
                          __typename: 'course_schedule_max_fields',
                          date: '2024-03-15T17:00:00Z',
                        },
                      },
                    },
                    participants: {
                      __typename: 'course_participant_aggregate',
                      aggregate: {
                        __typename: 'course_participant_aggregate_fields',
                        count: 15,
                      },
                    },
                    expenses: [
                      {
                        __typename: 'course_expenses',
                        id: 'exp001',
                        data: {
                          description: 'Training materials',
                          amount: 100.0,
                        },
                        trainer: {
                          __typename: 'profile',
                          id: 'trainer001',
                          fullName: 'John Doe',
                          avatar: 'https://example.com/avatar.jpg',
                          archived: false,
                        },
                      },
                    ],
                    schedule: [
                      {
                        __typename: 'course_schedule',
                        timeZone: 'America/New_York',
                        venue: {
                          __typename: 'venue',
                          id: 'venue001',
                          createdAt: '2023-12-01T12:00:00Z',
                          updatedAt: '2023-12-15T12:00:00Z',
                          name: 'Tech Hub',
                          city: 'New York',
                          addressLineOne: '123 Main St',
                          addressLineTwo: null,
                          postCode: '10001',
                          country: 'USA',
                          geoCoordinates: { lat: 40.7128, lng: -74.006 },
                          googlePlacesId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <BookingProvider>
          <CourseBookingReview />
        </BookingProvider>
      </Provider>,
    )

    expect(
      screen.getByTestId('course-name-row').textContent,
    ).toMatchInlineSnapshot(`"Positive Behaviour Training: Level One"`)

    expect(
      screen.getByTestId('mandatory-course-materials-row').textContent,
    ).toMatchInlineSnapshot(`"Mandatory Course Materials x 1£12.50"`)

    expect(
      screen.getByTestId('subtotal-row').textContent,
    ).toMatchInlineSnapshot(`"Subtotal£132.50"`)

    expect(screen.getByTestId('vat-row').textContent).toMatchInlineSnapshot(
      `"VAT (20%)£24.00"`,
    )

    expect(
      screen.getByTestId('amount-due-row').textContent,
    ).toMatchInlineSnapshot(`"Amount due (GBP)£156.50"`)
  })
})
