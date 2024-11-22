import { addDays, addHours } from 'date-fns'
import { DocumentNode } from 'graphql'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Course_Type_Enum,
  GetCoursesSourcesQuery,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { GET_COURSE_SOURCES_QUERY } from '@app/modules/course/queries/get-course-sources'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { cleanup, render, screen, userEvent, within } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildOrganization,
} from '@test/mock-data-utils'

import { EditCourseWithContext } from '../../contexts/EditCourseProvider'
import { EditCourse } from '../EditCourse'

import { ReviewLicensesOrder } from './ReviewLicensesOrder'

vi.mock('@app/hooks/useCourse')

const useCourseMocked = vi.mocked(useCourse)

describe(ReviewLicensesOrder.name, () => {
  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('should render', async () => {
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

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

    render(
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
})
