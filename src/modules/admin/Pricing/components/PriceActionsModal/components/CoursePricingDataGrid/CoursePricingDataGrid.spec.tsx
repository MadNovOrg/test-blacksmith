import { GridRowModes } from '@mui/x-data-grid'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { never, fromValue } from 'wonka'

import { UKsCountriesCodes } from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Course_Level_Enum,
  Course_Pricing,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { GET_COURSES_WITH_AVAILABLE_PRICING_QUERY } from '@app/modules/admin/Pricing/queries'

import { render, renderHook, screen } from '@test/index'
import { buildCoursePricing } from '@test/mock-data-utils'

import {
  CoursePricingDataGrid,
  getPricingFilter,
  getUpdatedRowModesModel,
} from './CoursePricingDataGrid'

const mockAuth = {
  acl: {
    isUK: vi.fn(() => false),
  },
  profile: { id: 'user-123' },
}

vi.mock('@app/context/auth', async () => ({
  ...(await vi.importActual('@app/context/auth')),
  useAuth: () => mockAuth,
}))

// Mock the currencies hook
vi.mock('@app/hooks/useCurrencies', () => ({
  useCurrencies: () => ({
    defaultCurrency: 'USD',
  }),
}))

// Mock the pricing hooks
vi.mock('@app/modules/admin/Pricing/hooks', () => ({
  useDeleteCoursePricing: () => [{ error: null }, vi.fn()],
  useInsertPricingEntry: () => [{ error: null }, vi.fn()],
  useUpdatePricingEntry: () => ({
    error: null,
    updatePricingSchedule: vi.fn(),
  }),
}))

describe('getUpdatedRowModesModel', () => {
  it('sets all existing rows to view with ignoreModifications true and sets clicked row to edit', () => {
    const initial = {
      row1: { mode: GridRowModes.Edit },
      row2: { mode: GridRowModes.View },
    }

    const updated = getUpdatedRowModesModel(initial, 'row1')

    expect(updated).toEqual({
      row1: { mode: GridRowModes.Edit },
      row2: { mode: GridRowModes.View, ignoreModifications: true },
    })
  })

  it('adds edit mode for a new row id', () => {
    const initial = {
      row1: { mode: GridRowModes.View },
    }

    const updated = getUpdatedRowModesModel(initial, 'row2')

    expect(updated).toEqual({
      row1: { mode: GridRowModes.View, ignoreModifications: true },
      row2: { mode: GridRowModes.Edit },
    })
  })
})

describe('getPricingFilter', () => {
  it('returns correct filter for UK courses', () => {
    const filter = getPricingFilter({
      blendedLearning: true,
      level: Course_Level_Enum.Level_1,
      reaccreditation: true,
      type: Course_Type_Enum.Closed,
      isUK: true,
    })

    expect(filter._and).toEqual(
      expect.arrayContaining([
        { go1Integration: { _eq: true } },
        { level: { _eq: Course_Level_Enum.Level_1 } },
        { reaccreditation: { _eq: true } },
        { type: { _eq: Course_Type_Enum.Closed } },
        { residingCountry: { _in: Object.keys(UKsCountriesCodes) } },
        { price: { _is_null: true } },
      ]),
    )
  })

  it('returns correct filter for AU courses', () => {
    const filter = getPricingFilter({
      blendedLearning: false,
      level: Course_Level_Enum.Level_2,
      reaccreditation: false,
      type: Course_Type_Enum.Open,
      isUK: false,
    })

    expect(filter._and).toEqual(
      expect.arrayContaining([
        { go1Integration: { _eq: false } },
        { level: { _eq: Course_Level_Enum.Level_2 } },
        { reaccreditation: { _eq: false } },
        { type: { _eq: Course_Type_Enum.Open } },
        { residingCountry: { _eq: 'AU' } },
      ]),
    )
  })

  it('does not add price null filter for non-closed courses', () => {
    const filter = getPricingFilter({
      blendedLearning: true,
      level: Course_Level_Enum.IntermediateTrainer,
      reaccreditation: true,
      type: Course_Type_Enum.Open,
      isUK: true,
    })

    const priceFilter = filter._and.find(f => 'price' in f)
    expect(priceFilter).toBeUndefined()
  })
})

describe(CoursePricingDataGrid.name, () => {
  const onSaveMock = vi.fn()
  const defaultPricingMock = null
  const user = userEvent.setup()

  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  // Mock client that captures query parameters
  const createMockClient = (
    queryData?: object,
    captureQuery?: (variables: object) => void,
  ) =>
    ({
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_COURSES_WITH_AVAILABLE_PRICING_QUERY) {
          return fromValue({
            data: queryData || {
              course_aggregate: { aggregate: { count: 0 } },
            },
          })
        }
        return fromValue({
          data: { course_aggregate: { aggregate: { count: 0 } } },
        })
      },
      executeMutation: () => vi.fn(() => never),
      query: (queryDoc: TypedDocumentNode, variables: object) => ({
        toPromise: () => {
          if (captureQuery) {
            captureQuery(variables)
          }
          const result = queryData || {
            course_aggregate: { aggregate: { count: 0 } },
          }
          return Promise.resolve({ data: result })
        },
      }),
    } as unknown as Client)

  const setup = ({
    client,
    pricingMock,
  }: {
    client?: Client
    pricingMock?: Course_Pricing | null
  } = {}) => {
    const defaultClient = createMockClient()
    return render(
      <Provider value={client ?? defaultClient}>
        <CoursePricingDataGrid
          onSave={onSaveMock}
          pricing={pricingMock ?? defaultPricingMock}
        />
      </Provider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.acl.isUK.mockReturnValue(false) // Default to non-UK
  })

  it('renders the grid component', () => {
    setup({})
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it.each([
    t('pages.course-pricing.modal-cols-effective-from'),
    t('pages.course-pricing.modal-cols-effective-to'),
    t('pages.course-pricing.cols-price'),
  ])('renders %s grid column', column => {
    setup({})
    expect(screen.getByText(column)).toBeInTheDocument()
  })

  it('renders pricing details', async () => {
    const pricing = buildCoursePricing()
    setup({ pricingMock: pricing })
    const effectiveFromDate = format(
      new Date(pricing.pricingSchedules[0].effectiveFrom),
      'M/d/yyyy',
    )
    const effectiveTo = format(
      new Date(pricing.pricingSchedules[0].effectiveTo),
      'M/d/yyyy',
    )
    const priceWithCurrency = `${t('currency', {
      amount: pricing.priceAmount.toFixed(2),
    })}`
    expect(await screen.findByTitle(effectiveFromDate)).toBeInTheDocument()
    expect(await screen.findByTitle(effectiveTo)).toBeInTheDocument()
    expect(await screen.findByTitle(priceWithCurrency)).toBeInTheDocument()
  })

  describe('Query Parameters for Delete Operation', () => {
    it('constructs correct query parameters for AU users with open course type', async () => {
      const pricing = buildCoursePricing({
        overrides: {
          blended: true,
          level: Course_Level_Enum.Advanced,
          reaccreditation: false,
          type: Course_Type_Enum.Open,
        },
      })

      const capturedQueries: object[] = []
      const client = createMockClient(
        { course_aggregate: { aggregate: { count: 0 } } },
        variables => capturedQueries.push(variables),
      )
      mockAuth.acl.isUK.mockReturnValue(false)

      setup({ client, pricingMock: pricing })

      const deleteButton = screen.getByTestId('delete-icon')
      await user.click(deleteButton)

      await waitFor(() => {
        expect(capturedQueries).toContainEqual(
          expect.objectContaining({
            where: {
              _and: [
                { go1Integration: { _eq: true } },
                { level: { _eq: Course_Level_Enum.Advanced } },
                { reaccreditation: { _eq: false } },
                { type: { _eq: Course_Type_Enum.Open } },
                { residingCountry: { _eq: 'AU' } },
              ],
            },
          }),
        )
      })
    })

    it('constructs correct query parameters for UK users', async () => {
      const pricing = buildCoursePricing({
        overrides: {
          type: Course_Type_Enum.Open,
          level: Course_Level_Enum.Level_1,
          blended: false,
          reaccreditation: true,
        },
      })

      const capturedQueries: object[] = []
      const client = createMockClient(
        { course_aggregate: { aggregate: { count: 0 } } },
        variables => capturedQueries.push(variables),
      )
      mockAuth.acl.isUK.mockReturnValue(true)

      setup({ client, pricingMock: pricing })

      const deleteButton = screen.getByTestId('delete-icon')
      await user.click(deleteButton)

      await waitFor(() => {
        expect(capturedQueries).toContainEqual(
          expect.objectContaining({
            where: {
              _and: [
                { go1Integration: { _eq: false } },
                { level: { _eq: Course_Level_Enum.Level_1 } },
                { reaccreditation: { _eq: true } },
                { type: { _eq: Course_Type_Enum.Open } },
                { residingCountry: { _in: Object.keys(UKsCountriesCodes) } },
              ],
            },
          }),
        )
      })
    })

    it('includes price null condition for closed course type', async () => {
      const pricing = buildCoursePricing({
        overrides: {
          type: Course_Type_Enum.Closed,
          level: Course_Level_Enum.IntermediateTrainer,
          blended: true,
          reaccreditation: false,
        },
      })

      const capturedQueries: object[] = []
      const client = createMockClient(
        { course_aggregate: { aggregate: { count: 0 } } },
        variables => capturedQueries.push(variables),
      )
      mockAuth.acl.isUK.mockReturnValue(false)

      setup({ client, pricingMock: pricing })

      const deleteButton = screen.getByTestId('delete-icon')
      await user.click(deleteButton)

      await waitFor(() => {
        expect(capturedQueries).toContainEqual(
          expect.objectContaining({
            where: {
              _and: [
                { go1Integration: { _eq: true } },
                { level: { _eq: Course_Level_Enum.IntermediateTrainer } },
                { reaccreditation: { _eq: false } },
                { type: { _eq: Course_Type_Enum.Closed } },
                { residingCountry: { _eq: 'AU' } },
                { price: { _is_null: true } },
              ],
            },
          }),
        )
      })
    })

    it('does not include price null condition for non-closed course type', async () => {
      const pricing = buildCoursePricing({
        overrides: {
          type: Course_Type_Enum.Open,
          level: Course_Level_Enum.Advanced,
          blended: false,
          reaccreditation: true,
        },
      })

      const capturedQueries: object[] = []
      const client = createMockClient(
        { course_aggregate: { aggregate: { count: 0 } } },
        variables => capturedQueries.push(variables),
      )
      mockAuth.acl.isUK.mockReturnValue(true)

      setup({ client, pricingMock: pricing })

      const deleteButton = screen.getByTestId('delete-icon')
      await user.click(deleteButton)

      await waitFor(() => {
        const matchingQuery = capturedQueries.find(query =>
          JSON.stringify(query).includes('"go1Integration"'),
        )
        expect(matchingQuery).toBeDefined()
        expect(JSON.stringify(matchingQuery)).not.toContain(
          '"price":{"_is_null":true}',
        )
      })
    })
  })
})
