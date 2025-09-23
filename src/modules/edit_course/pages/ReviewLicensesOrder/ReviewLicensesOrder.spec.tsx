import { addDays, addHours } from 'date-fns'
import { DocumentNode } from 'graphql'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Type_Enum,
  GetCoursesSourcesQuery,
  GetOrderDetailsForReviewQuery,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { useOrgResourcePacks } from '@app/modules/course/hooks/useOrgResourcePacks'
import { GET_COURSE_SOURCES_QUERY } from '@app/modules/course/queries/get-course-sources'
import { AwsRegions, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import {
  chance,
  cleanup,
  _render,
  screen,
  userEvent,
  within,
} from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildOrganization,
  buildProfile,
} from '@test/mock-data-utils'

import { EditCourseWithContext } from '../../contexts/EditCourseProvider'
import { GET_ORDER_DETAILS_FOR_REVIEW } from '../../queries/get-indirect-course-order'
import { EditCourse } from '../EditCourse'

import { ReviewLicensesOrder } from './ReviewLicensesOrder'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
  useFeatureFlagPayload: vi.fn(),
}))

vi.mock('@app/hooks/useCourse')
vi.mock('@app/modules/course/hooks/useOrgResourcePacks')

const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

const useCourseMocked = vi.mocked(useCourse)
const useOrgResourcePacksMocked = vi.mocked(useOrgResourcePacks)

describe(ReviewLicensesOrder.name, () => {
  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('should _render', async () => {
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    useOrgResourcePacksMocked.mockReturnValue({
      refetch: vi.fn(),
      resourcePacks: {
        balance: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
        reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
      },
    })

    const indirectBlCourse = buildCourse({
      overrides: {
        go1Integration: true,
        max_participants: 10,
        organization: {
          ...buildOrganization({
            overrides: {
              go1Licenses: 0,
            },
          }),
        },
        coursesReservedLicenses: 10,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
        type: Course_Type_Enum.Indirect,
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: indirectBlCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_COURSE_SOURCES_QUERY) {
          return fromValue<{ data: GetCoursesSourcesQuery }>({
            data: {
              sources: [
                {
                  name: 'EMAIL_ENQUIRY',
                },
                {
                  name: 'EVENT',
                },
              ],
            },
          })
        }
      },
      executeMutation: () => () => vi.fn(() => never),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
            <Route
              path="review-licenses-order"
              element={<ReviewLicensesOrder />}
            />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const maxParticipantsInput = screen.getByLabelText('Number of attendees', {
      exact: false,
    })

    await userEvent.clear(maxParticipantsInput)
    await userEvent.type(maxParticipantsInput, '15')

    const reviewConfirmBtn = screen.getByText('Review & confirm', {
      exact: false,
    })
    await userEvent.click(reviewConfirmBtn)

    const subtotalRow = screen.getByTestId('Subtotal-info-row')

    expect(
      // 250 = 50 * 5 (The maximum number of participants has increased to 5)
      within(subtotalRow).getByText('250', { exact: false }),
    ).toBeInTheDocument()
  })

  it('go to the Review and Confirm page if there are any required resource packs that need to be purchased', async () => {
    process.env.VITE_AWS_REGION = AwsRegions.Australia
    useFeatureFlagEnabledMock.mockReturnValue(true)

    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const course = buildCourse({
      overrides: {
        go1Integration: false,
        max_participants: 10,
        reservedResourcePacks: 10,
        residingCountry: 'AU',
        type: Course_Type_Enum.Indirect,

        organization: {
          ...buildOrganization({
            overrides: {
              go1Licenses: 0,
            },
          }),
        },
        organizationKeyContact: buildProfile({
          overrides: {
            country: 'Australia',
            countryCode: 'AU',
          },
        }),
        resourcePacksDeliveryType: null,
        resourcePacksType: Resource_Packs_Type_Enum.DigitalWorkbook,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              timeZone: 'Australia/Sydney',
            },
          }),
        ],
      },
    })
    useOrgResourcePacksMocked.mockReturnValue({
      refetch: vi.fn(),
      resourcePacks: {
        balance: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
        reserved: { DIGITAL_WORKBOOK: 0, PRINT_WORKBOOK: 0 },
      },
    })

    useCourseMocked.mockReturnValue({
      data: { course: course },
      mutate: vi.fn(),
      status: LoadingStatus.IDLE,
    })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === GET_ORDER_DETAILS_FOR_REVIEW) {
          return fromValue<{ data: GetOrderDetailsForReviewQuery }>({
            data: {
              order_by_pk: {
                billingAddress: chance.address(),
                email: chance.email(),
                firstName: chance.first(),
                organization: { id: chance.guid(), name: chance.company() },
                phone: chance.phone(),
                purchaseOrder: chance.word(),
                surname: chance.last(),
              },
            },
          })
        }
      },
      executeMutation: () => () => vi.fn(() => never),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
            <Route
              path="review-licenses-order"
              element={<ReviewLicensesOrder />}
            />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const maxParticipantsInput = screen.getByLabelText('Number of attendees', {
      exact: false,
    })

    await userEvent.clear(maxParticipantsInput)
    await userEvent.type(maxParticipantsInput, '15')

    const reviewConfirmBtn = screen.getByText('Review & confirm', {
      exact: false,
    })
    await userEvent.click(reviewConfirmBtn)

    expect(
      screen.getByText('Resource pack - Digital Workbook & Connect redeemed', {
        exact: false,
      }),
    ).toBeInTheDocument()
  })
})
