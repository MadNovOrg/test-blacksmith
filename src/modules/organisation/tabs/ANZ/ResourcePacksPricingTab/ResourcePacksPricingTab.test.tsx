import { t } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { CombinedError } from 'urql'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import { useResourcePacksPricing } from '@app/modules/organisation/hooks/useResourcePacksPricing'
import { AwsRegions } from '@app/types'
import { CourseTypeOrgRPPricings } from '@app/util'

import { screen, chance, render, userEvent } from '@test/index'

import { ResourcePacksPricingTab } from './ResourcePacksPricingTab'

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

vi.mock('@app/modules/organisation/hooks/useResourcePacksPricing')
const useResourcePacksPricingMock = vi.mocked(useResourcePacksPricing)

const pricings = [
  {
    id: chance.guid(),
    course_type: Course_Type_Enum.Closed,
    course_level: Course_Level_Enum.Level_1,
    resource_packs_type: Resource_Packs_Type_Enum.PrintWorkbook,
    resource_packs_delivery_type: null,
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
    useResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: undefined,
      fetching: false,
    })
  })

  it('should render the component', () => {
    render(<ResourcePacksPricingTab orgId={chance.guid()} />)
    expect(
      screen.getByTestId('resource-packs-pricing-title'),
    ).toBeInTheDocument()
  })

  it('should not render the table if pricings are still loading', () => {
    useResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: undefined,
      fetching: true,
    })
    render(<ResourcePacksPricingTab orgId={chance.guid()} />)
    expect(
      screen.queryByTestId('resource-packs-pricing-table'),
    ).not.toBeInTheDocument()
  })

  it('should not render the table if there was an error loading prices', () => {
    useResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: new CombinedError({ networkError: Error('Error loading prices') }),
      fetching: false,
    })
    render(<ResourcePacksPricingTab orgId={chance.guid()} />)
    expect(
      screen.queryByTestId('resource-packs-pricing-table'),
    ).not.toBeInTheDocument()
  })

  it('Should render the button, tabs and prices table', () => {
    render(<ResourcePacksPricingTab orgId={chance.guid()} />)

    // ApplyMainOrgRPPricingToAffiliates button
    expect(
      screen.getByTestId('apply-main-org-prices-to-affiliates'),
    ).toBeInTheDocument()

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
    'Should render only the prices for the %s course type',
    async courseType => {
      render(<ResourcePacksPricingTab orgId={chance.guid()} />)
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
