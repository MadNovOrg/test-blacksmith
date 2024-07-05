import { addDays, addHours } from 'date-fns'
import { DocumentNode } from 'graphql'
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
import { GET_COURSE_SOURCES_QUERY } from '@app/queries/courses/get-course-sources'
import { BildStrategies, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import {
  cleanup,
  render,
  renderHook,
  screen,
  userEvent,
  waitFor,
} from '@test/index'
import { buildCourse, buildCourseSchedule } from '@test/mock-data-utils'

import { EditCourse } from '.'

vi.mock('@app/hooks/useCourse')
vi.mock('@app/components/VenueSelector', () => ({
  VenueSelector: vi.fn(),
}))
vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
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
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('pre-selects and disables blended learning, reaccreditation toggles on BILD course', async () => {
    const openCourse = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Bild,
        type: Course_Type_Enum.Open,
        level: Course_Level_Enum.BildIntermediateTrainer,
        go1Integration: false,
        reaccreditation: false,
        conversion: true,
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
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
          </Routes>
        </Provider>,
        { auth: { activeRole: RoleName.TT_ADMIN } },
        { initialEntries: ['/courses/edit/1'] },
      )
    })

    const blendedLearningToggle = screen.getByLabelText(/blended learning/i)
    const reaccreditationToggle = screen.getByLabelText(/reaccreditation/i)
    const conversionToggle = screen.getByLabelText(/conversion course/i)

    expect(blendedLearningToggle).toBeDisabled()
    expect(blendedLearningToggle).not.toBeChecked()

    expect(conversionToggle).toBeDisabled()
    expect(conversionToggle).toBeChecked()

    expect(reaccreditationToggle).toBeDisabled()
    expect(reaccreditationToggle).not.toBeChecked()
  })

  it("doesn't allow editing VAT and currency for International OPEN courses", async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'RO',
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
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it("doesn't allow editing VAT and currency for International CLOSED courses", async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'RO',
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
      render(
        <Provider value={client}>
          <Routes>
            <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('allows editing an ICM International OPEN course and not show the price error banner', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'DE',
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
        priceCurrency: Currency.Eur,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('allows editing an ICM International CLOSED course and not show the price error banner', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'DE',
        accreditedBy: Accreditors_Enum.Icm,
        mandatory_course_materials: 6,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              timeZone: 'Europe/Berlin',
            },
          }),
        ],
        priceCurrency: Currency.Eur,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
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

  it('allows editing a BILD OPEN course and not show the price error banner', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openBildCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        level: Course_Level_Enum.BildIntermediateTrainer,
        residingCountry: 'GB-ENG',
        accreditedBy: Accreditors_Enum.Bild,
        bildStrategies: [{ strategyName: BildStrategies.Primary }],
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
        course: openBildCourse,
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
                level: Course_Level_Enum.BildIntermediateTrainer,
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
              id: openBildCourse.id,
              level: Course_Level_Enum.BildIntermediateTrainer,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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
        `/courses/${openBildCourse.id}/details`,
      )
    })
  })

  it('allows editing a BILD CLOSED course and not show the price error banner', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedBildCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        level: Course_Level_Enum.BildRegular,
        residingCountry: 'GB-ENG',
        accreditedBy: Accreditors_Enum.Bild,
        bildStrategies: [{ strategyName: BildStrategies.Primary }],
        max_participants: 3,
        mandatory_course_materials: 2,
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
        course: closedBildCourse,
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
                  level: Course_Level_Enum.BildRegular,
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
              id: closedBildCourse.id,
              level: Course_Level_Enum.BildRegular,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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
        `/courses/${closedBildCourse.id}/details`,
      )
    })
  })

  it('allows editing a BILD INDIRECT course and not show the price error banner', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const bildIndirectCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
        level: Course_Level_Enum.BildIntermediateTrainer,
        residingCountry: 'GB-ENG',
        accreditedBy: Accreditors_Enum.Bild,
        bildStrategies: [{ strategyName: BildStrategies.Primary }],
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
        course: bildIndirectCourse,
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
                level: Course_Level_Enum.BildIntermediateTrainer,
                type: Course_Type_Enum.Indirect,
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
              id: bildIndirectCourse.id,
              level: Course_Level_Enum.BildIntermediateTrainer,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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
        `/courses/${bildIndirectCourse.id}/details`,
      )
    })
  })

  it('allows editing an ICM OPEN course with UK country that has a scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'GB-ENG', // specifically set the country to UK
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
                    priceCurrency: Currency.Gbp,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('allows editing an ICM CLOSED course with UK country that has a scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'GB-ENG', // specifically set the country to UK
        accreditedBy: Accreditors_Enum.Icm,
        mandatory_course_materials: 2,
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
                      priceCurrency: Currency.Gbp,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const errorBanner = screen.queryByTestId('price-error-banner')
    const saveButton = screen.getByTestId('save-button')
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

  it('allows editing an ICM CLOSED, Level 2, Blended Learning course with more than 8 participants and UK country that has a scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        level: Course_Level_Enum.Level_2,
        residingCountry: 'GB-ENG', // specifically set the country to UK
        accreditedBy: Accreditors_Enum.Icm,
        go1Integration: true,
        max_participants: 15,
        mandatory_course_materials: 2,
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
                  level: Course_Level_Enum.Level_2,
                  type: Course_Type_Enum.Closed,
                  blended: true,
                  reaccreditation: false,
                  pricingSchedules: [
                    {
                      priceAmount: 150,
                      priceCurrency: Currency.Gbp,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('does not allow editing an ICM OPEN course with UK country that has no scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const openCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        residingCountry: 'GB-ENG', // specifically set the country to UK
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('does not allow editing an ICM CLOSED course with UK country that has no scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'GB-ENG', // specifically set the country to UK
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('does not allow editing an ICM CLOSED, Level 2, Blended Learning course with more than 8 participants and UK country that has no scheduled price', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        level: Course_Level_Enum.Level_2,
        residingCountry: 'GB-ENG', // specifically set the country to UK
        accreditedBy: Accreditors_Enum.Icm,
        go1Integration: true,
        max_participants: 15,
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
                  level: Course_Level_Enum.Level_2,
                  type: Course_Type_Enum.Closed,
                  blended: true,
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
              level: Course_Level_Enum.Level_2,
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('free course materials should display correctly', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'GB-ENG', // specifically set the country to UK
        accreditedBy: Accreditors_Enum.Icm,
        mandatory_course_materials: 2,
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
                      priceCurrency: Currency.Gbp,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const maxParticipantsInput = screen.getByLabelText('Number of attendees', {
      exact: false,
    })
    const mcmInput = screen.getByLabelText('chargeable Course Materials', {
      exact: false,
    })

    await userEvent.clear(maxParticipantsInput)
    await userEvent.type(maxParticipantsInput, '8')
    await userEvent.clear(mcmInput)
    await userEvent.type(mcmInput, '6')

    await waitFor(() => {
      expect(screen.getByTestId('free-course-materials').textContent).toEqual(
        t(
          'components.course-form.mandatory-course-materials.amount-of-free-mcm',
          {
            count: 2,
          },
        ),
      )
    })
  })

  it('does not allow editing MCM amount on an ICM CLOSED course if max participants was not changed', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'GB-ENG', // specifically set the country to UK
        accreditedBy: Accreditors_Enum.Icm,
        mandatory_course_materials: 2,
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
                      priceCurrency: Currency.Gbp,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
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

  it('displays error message if MCM is bigger than max participants', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    const startDate = addDays(new Date(), 2)
    const endDate = addHours(startDate, 8)

    const closedCourse = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        residingCountry: 'GB-ENG', // specifically set the country to UK
        accreditedBy: Accreditors_Enum.Icm,
        mandatory_course_materials: 2,
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
                      priceCurrency: Currency.Gbp,
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

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/courses/edit/:id" element={<EditCourse />} />
        </Routes>
      </Provider>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/edit/1`] },
    )

    const maxParticipantsInput = screen.getByLabelText('Number of attendees', {
      exact: false,
    })
    const mcmInput = screen.getByLabelText('Materials', { exact: false })

    userEvent.clear(maxParticipantsInput)
    userEvent.type(maxParticipantsInput, '24')

    userEvent.clear(mcmInput)
    userEvent.type(mcmInput, '25')
    const saveButton = screen.getByTestId('save-button')
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(
        screen.queryByText(
          t(
            'components.course-form.mandatory-course-materials.errors.more-mcm-than-attendees-edit',
          ),
        ),
      ).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
