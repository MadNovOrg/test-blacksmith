import { t } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { CombinedError } from 'urql'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'
import { AwsRegions, RoleName } from '@app/types'
import { CourseTypeOrgRPPricings } from '@app/util'

import { screen, chance, _render, userEvent } from '@test/index'

import { ResourcePacksPricingTab } from './ResourcePacksPricingTab'

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

vi.mock('@app/modules/organisation/hooks/useAllResourcePacksPricing')
const useAllResourcePacksPricingMock = vi.mocked(useAllResourcePacksPricing)
const pricings = [
  {
    id: chance.guid(),
    course_type: Course_Type_Enum.Closed,
    course_level: Course_Level_Enum.Level_1,
    resource_packs_type: Resource_Packs_Type_Enum.PrintWorkbook,
    resource_packs_delivery_type: null,
    org_resource_packs_pricings: [],
    reaccred: false,
    AUD_price: 52,
    NZD_price: 56,
  },
  {
    id: chance.guid(),
    course_type: Course_Type_Enum.Indirect,
    course_level: Course_Level_Enum.Level_1,
    resource_packs_type: Resource_Packs_Type_Enum.PrintWorkbook,
    resource_packs_delivery_type: Resource_Packs_Delivery_Type_Enum.Standard,
    reaccred: false,
    org_resource_packs_pricings: [],
    AUD_price: 52,
    NZD_price: 56,
  },
]

describe('component: ResourcePacksPricingTab', () => {
  useFeatureFlagEnabledMock.mockReturnValue(true)

  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })

  beforeEach(() => {
    useAllResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: undefined,
      fetching: false,
      refetch: vi.fn(),
    })
  })

  it('should _render the component', () => {
    _render(<ResourcePacksPricingTab />)
    expect(
      screen.getByTestId('resource-packs-pricing-title'),
    ).toBeInTheDocument()
  })

  it('should not _render the table if pricings are still loading', () => {
    useAllResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: undefined,
      fetching: true,
      refetch: vi.fn(),
    })
    _render(<ResourcePacksPricingTab />)
    expect(
      screen.queryByTestId('resource-packs-pricing-table'),
    ).not.toBeInTheDocument()
  })

  it('should not _render the table if there was an error loading prices', () => {
    useAllResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: new CombinedError({ networkError: Error('Error loading prices') }),
      fetching: false,
      refetch: vi.fn(),
    })
    _render(<ResourcePacksPricingTab />)
    expect(
      screen.queryByTestId('resource-packs-pricing-table'),
    ).not.toBeInTheDocument()
  })

  it('Should _render the button, tabs and prices table', () => {
    _render(<ResourcePacksPricingTab />, {
      auth: {
        activeRole: chance.pickone([
          RoleName.TT_ADMIN,
          RoleName.TT_OPS,
          RoleName.FINANCE,
        ]),
      },
    })

    // Closed and Indirect tabs
    expect(
      screen.getByTestId('resource-packs-pricing-tab-CLOSED'),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('resource-packs-pricing-tab-INDIRECT'),
    ).toBeInTheDocument()

    // Pricings table
    expect(
      screen.getByTestId('resource-packs-pricing-table'),
    ).toBeInTheDocument()
  })

  it.each(CourseTypeOrgRPPricings)(
    'Should _render only the prices for the %s course type',
    async courseType => {
      _render(<ResourcePacksPricingTab />, {
        auth: {
          activeRole: chance.pickone([
            RoleName.TT_ADMIN,
            RoleName.TT_OPS,
            RoleName.FINANCE,
          ]),
        },
      })
      const courseTypeTab = screen.getByTestId(
        `resource-packs-pricing-tab-${courseType}`,
      )
      await userEvent.click(courseTypeTab)

      // Table should contain only pricings coresponding to the selected course type
      const table = screen.getByTestId('resource-packs-pricing-table')
      expect(table).toBeInTheDocument()
      expect(table).toHaveTextContent(t(`course-types.${courseType}`))
      expect(table).not.toHaveTextContent(
        Object.values(CourseTypeOrgRPPricings)
          .filter(c => c === courseType)
          .join(''),
      )
      const filteredPricings = pricings.filter(
        p => p.course_type === courseType,
      )
      filteredPricings.forEach(p => {
        const key = `${p.course_type}-${p.course_level}-${p.reaccred}`
        expect(table).toContainElement(screen.getByTestId(key))
        // Edit button
        expect(table).toContainElement(screen.getByTestId(`edit-button-${key}`))
      })
    },
  )
})
