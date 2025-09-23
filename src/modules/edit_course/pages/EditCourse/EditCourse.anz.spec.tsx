import { addDays, addHours } from 'date-fns'
import { DocumentNode } from 'graphql'
import posthog from 'posthog-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { VenueSelector } from '@app/components/VenueSelector'
import {
  Accreditors_Enum,
  CoursePriceQuery,
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
  GetCoursesSourcesQuery,
  UpdateCourseMutation,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { COURSE_PRICE_QUERY } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { GET_COURSE_SOURCES_QUERY } from '@app/modules/course/queries/get-course-sources'
import { AwsRegions, BildStrategies, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import {
  cleanup,
  _render,
  renderHook,
  screen,
  userEvent,
  waitFor,
} from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildProfile,
} from '@test/mock-data-utils'

import { EditCourseWithContext } from '../../contexts/EditCourseProvider'

import { EditCourse } from '.'

vi.mock('@app/hooks/useCourse')
vi.mock('@app/components/VenueSelector', () => ({
  VenueSelector: vi.fn(),
}))
vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
  useFeatureFlagPayload: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

const useCourseMocked = vi.mocked(useCourse)
const VenueSelectorMocked = vi.mocked(VenueSelector)
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe(EditCourse.name, () => {
  vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  beforeAll(() => {
    VenueSelectorMocked.mockImplementation(() => <p>test</p>)
  })
  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('displays spinner while loading for the course', () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.FETCHING,
      data: undefined,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.getByTestId('edit-course-fetching')).toBeInTheDocument()
  })

  it('displays a message if there is no course', () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: undefined,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.queryByTestId('edit-course-fetching')).not.toBeInTheDocument()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("displays an error message if can't load the course to edit", () => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.ERROR,
      data: undefined,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.queryByTestId('edit-course-fetching')).not.toBeInTheDocument()
    expect(
      screen.getByText('There was an error loading the course'),
    ).toBeInTheDocument()
  })

  it("doesn't allow trainer to edit open course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: {
        course: openCourse,
      },
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to edit open course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: {
        course: openCourse,
      },
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.USER } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow trainer to edit closed course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: {
        course: openCourse,
      },
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TRAINER } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to edit closed course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: {
        course: openCourse,
      },
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.USER } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow Sales admin role to edit indirect course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: {
        course: openCourse,
      },
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.SALES_ADMIN } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to edit indirect course", () => {
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
      },
    })

    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: {
        course: openCourse,
      },
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.USER } },
      { initialEntries: ['/courses/edit/1'] },
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('pre-selects and disables BILD strategy toggles when editing', async () => {
    const openCourse = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Bild,
        type: Course_Type_Enum.Closed,
        bildStrategies: [
          { strategyName: BildStrategies.Primary },
          { strategyName: BildStrategies.Secondary },
        ],
        level: Course_Level_Enum.BildRegular,
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: openCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    await waitFor(() => {
      _render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
              <Route index element={<EditCourse />} />
            </Route>
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] },
      )
    })

    const primaryToggle = screen.getByLabelText(/primary/i)
    const secondaryToggle = screen.getByLabelText(/secondary/i)
    const nonRestrictiveToggle = screen.getByLabelText(
      /non restrictive tertiary/i,
    )
    const intermediateToggle = screen.getByLabelText(
      /restrictive tertiary intermediate/i,
    )
    const advancedToggle = screen.getByLabelText(
      /restrictive tertiary advanced/i,
    )

    const selectedToggles = [primaryToggle, secondaryToggle]
    const notSelectedToggles = [
      nonRestrictiveToggle,
      intermediateToggle,
      advancedToggle,
    ]

    selectedToggles.forEach(toggle => {
      expect(toggle).toBeChecked()
      expect(toggle).toBeDisabled()
    })

    notSelectedToggles.forEach(toggle => {
      expect(toggle).not.toBeChecked()
      expect(toggle).toBeDisabled()
    })
  })

  it('pre-selects and disables blended learning, reaccreditation toggles on ICM course', async () => {
    const closedCourse = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type: Course_Type_Enum.Closed,
        level: Course_Level_Enum.Level_1,
        go1Integration: true,
        reaccreditation: false,
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    await waitFor(() => {
      _render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
              <Route index element={<EditCourse />} />
            </Route>
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] },
      )
    })

    const blendedLearningToggle = screen.getByLabelText(/blended learning/i)
    const reaccreditationToggle = screen.getByLabelText(/reaccreditation/i)

    expect(blendedLearningToggle).toBeDisabled()
    expect(blendedLearningToggle).toBeChecked()

    expect(reaccreditationToggle).toBeDisabled()
    expect(reaccreditationToggle).not.toBeChecked()
  })

  it("doesn't allow editing VAT and currency for OPEN courses in country other than AU", async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'FJ',
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: openCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    await waitFor(() => {
      _render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
              <Route index element={<EditCourse />} />
            </Route>
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] },
      )
    })

    const currencySelector = screen.getByTestId('currency-selector')
    const VATswitch = screen.getByTestId('includeVAT-switch')

    expect(currencySelector).toBeInTheDocument()
    expect(VATswitch).toBeInTheDocument()

    expect(currencySelector.children[0]).toHaveClass('Mui-disabled')
    expect(VATswitch).toHaveClass('Mui-disabled')
  })

  it("doesn't allow editing VAT and currency CLOSED courses in country other than AU", async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'FJ',
        accreditedBy: Accreditors_Enum.Icm,
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    await waitFor(() => {
      _render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
              <Route index element={<EditCourse />} />
            </Route>
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] },
      )
    })

    const currencySelector = screen.getByTestId('currency-selector')
    const VATswitch = screen.getByTestId('includeVAT-switch')

    expect(currencySelector).toBeInTheDocument()
    expect(VATswitch).toBeInTheDocument()

    expect(currencySelector.children[0]).toHaveClass('Mui-disabled')
    expect(VATswitch).toHaveClass('Mui-disabled')
  })

  it('allows editing an ICM non-Australia OPEN course and not show the price error banner', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'FJ',
        accreditedBy: Accreditors_Enum.Icm,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              timeZone: 'Europe/Berlin',
            },
          }),
        ],
        orders: [],
        priceCurrency: Currency.Nzd,
        includeVAT: true,
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: openCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: openCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    await waitFor(() => {
      // ensure there's no price error banner shown
      expect(errorBanner).not.toBeInTheDocument()

      // ensure it succesfully navigates back to course details page
      expect(mockNavigate).toHaveBeenCalledWith(
        `/courses/${openCourse.id}/details`,
      )
    })
  })

  it('allows editing an ICM non-Australia CLOSED course and not show the price error banner', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'FJ',
        accreditedBy: Accreditors_Enum.Icm,
        free_course_materials: 6,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              timeZone: 'Europe/Berlin',
            },
          }),
        ],
        priceCurrency: Currency.Nzd,
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
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
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    waitFor(() => {
      // ensure there's no price error banner shown
      expect(errorBanner).not.toBeInTheDocument()

      // ensure it succesfully navigates back to course details page
      expect(mockNavigate).toHaveBeenCalledWith(
        `/courses/${closedCourse.id}/details`,
      )
    })
  })

  it('allows editing an ICM OPEN course with Australia country that has a scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        schedule: [
          buildCourseSchedule({
            overrides: {
              timeZone: 'Australia/Sydney',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: openCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Open,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 150,
                    priceCurrency: Currency.Aud,
                  },
                ],
              },
            ],
          },
        }),
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: openCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/${openCourse.id}`] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    await waitFor(() => {
      // ensure there's no price error banner shown
      expect(errorBanner).not.toBeInTheDocument()

      // ensure it succesfully navigates back to course details page
      expect(mockNavigate).toHaveBeenCalledWith(
        `/courses/${openCourse.id}/details`,
      )
    })
  })

  it('allows editing an ICM OPEN course with Australia country and Foundation Trainer Level that has a scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    vi.spyOn(posthog, 'getFeatureFlag').mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'AU',
        level: Course_Level_Enum.FoundationTrainer,
        accreditedBy: Accreditors_Enum.Icm,
        schedule: [
          buildCourseSchedule({
            overrides: {
              timeZone: 'Australia/Sydney',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: openCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.FoundationTrainer,
                type: Course_Type_Enum.Open,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [
                  {
                    priceAmount: 150,
                    priceCurrency: Currency.Aud,
                  },
                ],
              },
            ],
          },
        }),
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: openCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/${openCourse.id}`] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    await waitFor(() => {
      // ensure there's no price error banner shown
      expect(errorBanner).not.toBeInTheDocument()

      // ensure it succesfully navigates back to course details page
      expect(mockNavigate).toHaveBeenCalledWith(
        `/courses/${openCourse.id}/details`,
      )
    })
  })

  it('allows editing an ICM CLOSED course with Australia country that has a scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        free_course_materials: 2,
        schedule: [
          buildCourseSchedule({
            overrides: {
              timeZone: 'Australia/Sydney',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
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

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_1,
                  type: Course_Type_Enum.Closed,
                  blended: false,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: 150,
                      priceCurrency: Currency.Aud,
                    },
                  ],
                },
              ],
            },
          })
        }
      },
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    waitFor(() => {
      // ensure there's no price error banner shown
      expect(errorBanner).not.toBeInTheDocument()

      // ensure it succesfully navigates back to course details page
      expect(mockNavigate).toHaveBeenCalledWith(
        `/courses/${closedCourse.id}/details`,
      )
    })
  })

  it('allows editing an ICM CLOSED, Level 2, Blended Learning course with more than 8 participants and UK country that has a scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        bookingContact: buildProfile({
          overrides: { country: 'Australia', countryCode: 'AU' },
        }),
        type: Course_Type_Enum.Closed,
        level: Course_Level_Enum.Level_2,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        go1Integration: true,
        max_participants: 15,
        free_course_materials: 2,
        schedule: [
          buildCourseSchedule({
            overrides: {
              timeZone: 'Australia/Sydney',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
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

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_2,
                  type: Course_Type_Enum.Closed,
                  blended: true,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: 150,
                      priceCurrency: Currency.Aud,
                    },
                  ],
                },
              ],
            },
          })
        }
      },
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_2,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    await waitFor(() => {
      // ensure there's no price error banner
      expect(errorBanner).not.toBeInTheDocument()

      // ensure it succesfully navigates back to course details page
      expect(mockNavigate).toHaveBeenCalledWith(
        `/courses/${closedCourse.id}/details`,
      )
    })
  })

  it('does not allow editing an ICM OPEN course with Australia country that has no scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        schedule: [
          buildCourseSchedule({
            overrides: {
              timeZone: 'Australia/Sydney',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: openCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: CoursePriceQuery }>({
          data: {
            coursePrice: [
              {
                level: Course_Level_Enum.Level_1,
                type: Course_Type_Enum.Open,
                blended: false,
                reaccreditation: false,
                pricingSchedules: [],
              },
            ],
          },
        }),
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: openCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    await waitFor(() => {
      // ensure the price error banner is shown
      expect(errorBanner).toBeInTheDocument()
      expect(errorBanner).toHaveTextContent(
        t('pages.create-course.no-course-price'),
      )

      // ensure it doesn't navigate back to course details page
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('does not allow editing an ICM CLOSED course with Australia country that has no scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
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

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_1,
                  type: Course_Type_Enum.Closed,
                  blended: false,
                  reaccreditation: false,
                  pricingSchedules: [],
                },
              ],
            },
          })
        }
      },
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: ['/courses/edit/1'] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    await waitFor(() => {
      // ensure the price error banner is shown
      expect(errorBanner).toBeInTheDocument()
      expect(errorBanner).toHaveTextContent(
        t('pages.create-course.no-course-price'),
      )

      // ensure it doesn't navigate back to course details page
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('displays error message if number of max participants is less than the sum of participants count and pending invites count', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        max_participants: 5,
        free_course_materials: 2,
        attendeesCount: { aggregate: { count: 2 } },
        participantsPendingInvites: { aggregate: { count: 2 } },
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
      },
      status: LoadingStatus.IDLE,
      mutate: vi.fn(),
    })

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_1,
                  type: Course_Type_Enum.Closed,
                  blended: false,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: 150,
                      priceCurrency: Currency.Aud,
                    },
                  ],
                },
              ],
            },
          })
        }
      },
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
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
    await userEvent.type(maxParticipantsInput, '3')

    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    expect(
      screen.queryByText(
        t('components.course-form.min-required-max-participants'),
      ),
    ).toBeInTheDocument()
  })

  it.skip('mandatory course materials should display correctly', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        free_course_materials: 2,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
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

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_1,
                  type: Course_Type_Enum.Closed,
                  blended: false,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: 150,
                      priceCurrency: Currency.Aud,
                    },
                  ],
                },
              ],
            },
          })
        }
      },
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const maxParticipantsInput = screen.getByLabelText('Number of attendees', {
      exact: false,
    })
    const mcmInput = screen.getByLabelText('Materials', {
      exact: false,
    })

    await userEvent.clear(maxParticipantsInput)
    await userEvent.type(maxParticipantsInput, '8')
    await userEvent.clear(mcmInput)
    await userEvent.type(mcmInput, '6')

    waitFor(() => {
      expect(
        screen.getByTestId('mandatory-course-materials').textContent,
      ).toEqual(
        t(
          'components.course-form.free-course-materials.amount-of-mandatory-mcm',
          {
            count: 2,
          },
        ),
      )
    })
  })

  it.skip('does not allow editing MCM amount on an ICM CLOSED course if max participants was not changed', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        free_course_materials: 2,
        max_participants: 24,
        schedule: [
          buildCourseSchedule({
            overrides: {
              timeZone: 'Australia/Sydney',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
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

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_1,
                  type: Course_Type_Enum.Closed,
                  blended: false,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: 150,
                      priceCurrency: Currency.Aud,
                    },
                  ],
                },
              ],
            },
          })
        }
      },
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
    const maxParticipantsInput = screen.getByLabelText('Number of attendees', {
      exact: false,
    })

    const mcmInput = screen.getByLabelText('Materials', { exact: false })

    await waitFor(() => {
      expect(mcmInput).toBeDisabled()
    })
    userEvent.clear(maxParticipantsInput)
    userEvent.type(maxParticipantsInput, '24')

    await waitFor(() => {
      expect(mcmInput).not.toBeDisabled()
    })

    await userEvent.click(saveButton)

    await waitFor(() => {
      // ensure there's no price error banner shown
      expect(errorBanner).not.toBeInTheDocument()

      // ensure it succesfully navigates back to course details page
      expect(mockNavigate).toHaveBeenCalledWith(
        `/courses/${closedCourse.id}/details`,
      )
    })
  })

  it.skip('displays error message if MCM is bigger than max participants', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'AU',
        accreditedBy: Accreditors_Enum.Icm,
        free_course_materials: 2,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            },
          }),
        ],
      },
    })

    useCourseMocked.mockReturnValue({
      data: {
        course: closedCourse,
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

        if (query === COURSE_PRICE_QUERY) {
          return fromValue<{ data: CoursePriceQuery }>({
            data: {
              coursePrice: [
                {
                  level: Course_Level_Enum.Level_1,
                  type: Course_Type_Enum.Closed,
                  blended: false,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: 150,
                      priceCurrency: Currency.Aud,
                    },
                  ],
                },
              ],
            },
          })
        }
      },
      executeMutation: () =>
        fromValue<{ data: UpdateCourseMutation }>({
          data: {
            updateCourse: {
              id: closedCourse.id,
              level: Course_Level_Enum.Level_1,
            },
          },
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourseWithContext />}>
            <Route index element={<EditCourse />} />
          </Route>
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const maxParticipantsInput = screen.getByLabelText('Number of attendees', {
      exact: false,
    })
    const mcmInput = screen.getByLabelText('Materials', { exact: false })
    expect(mcmInput).toBeInTheDocument()

    userEvent.clear(maxParticipantsInput)
    userEvent.type(maxParticipantsInput, '24')

    userEvent.clear(mcmInput)
    userEvent.type(mcmInput, '25')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    waitFor(() => {
      expect(
        screen.queryByText(
          t(
            'components.course-form.free-course-materials.errors.more-fcm-than-attendees-edit',
          ),
        ),
      ).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
