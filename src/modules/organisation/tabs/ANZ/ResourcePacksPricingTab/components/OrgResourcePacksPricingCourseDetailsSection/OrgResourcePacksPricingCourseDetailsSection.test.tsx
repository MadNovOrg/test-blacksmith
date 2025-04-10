import { renderHook } from '@testing-library/react'
import { Client, Provider } from 'urql'

import {
  Course_Type_Enum,
  Course_Level_Enum,
  Resource_Packs_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'

import { chance, screen, render } from '@test/index'

import { ResourcePacksPricingProvider } from '../../ResourcePacksPricingProvider'
import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'

import { OrgResourcePacksPricingCourseDetailsSection } from '.'

vi.mock('@app/modules/organisation/hooks/useAllResourcePacksPricing')
const useAllResourcePacksPricingMock = vi.mocked(useAllResourcePacksPricing)

vi.mock(
  '@app/modules/organisation/tabs/ANZ/ResourcePacksPricingTab/ResourcePacksPricingProvider/useResourcePacksPricingContext',
)
const useResourcePacksPricingContextMock = vi.mocked(
  useResourcePacksPricingContext,
)

const pricings = [
  {
    id: chance.guid(),
    course_type: Course_Type_Enum.Closed,
    course_level: Course_Level_Enum.Level_1,
    resource_packs_type: Resource_Packs_Type_Enum.PrintWorkbook,
    resource_packs_delivery_type: null,
    org_resource_packs_pricings: [],
    org_resource_packs_pricings_aggregate: {
      aggregate: {
        count: 1,
      },
      nodes: [],
    },
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
    org_resource_packs_pricings_aggregate: {
      aggregate: {
        count: 1,
      },
      nodes: [],
    },
    AUD_price: 52,
    NZD_price: 56,
  },
]

describe('component: OrgResourcePacksPricingCourseDetailsSection', () => {
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
  pricings.forEach(pricing => {
    it(`should render the component for course type: ${pricing.course_type}`, async () => {
      useResourcePacksPricingContextMock.mockReturnValueOnce({
        pricing: {
          key: `${pricing.course_type}-${pricing.course_level}-${pricing.reaccred}`,
          courseType: pricing.course_type,
          courseLevel: pricing.course_level,
          reaccred: pricing.reaccred,
          values: [pricing],
        },
        fetching: false,
        refetch: () => vi.fn(),
        groupedData: [],
        setSelectedPricing: () => vi.fn(),
        error: undefined,
        main_organisation_id: null,
        orgResourcePacksPricings: [],
      })
      const {
        result: {
          current: { t, _t },
        },
      } = renderHook(() =>
        useScopedTranslation(
          'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal.org-resource-packs-pricing-course-details-section',
        ),
      )

      const mockClient = {
        executeQuery: vi.fn(),
        executeMutation: vi.fn(),
      } as unknown as Client

      render(
        <Provider value={mockClient}>
          <ResourcePacksPricingProvider>
            <OrgResourcePacksPricingCourseDetailsSection />
          </ResourcePacksPricingProvider>
          ,
        </Provider>,
      )

      const attributesColumn = (
        reaccred: boolean,
        courseType: Course_Type_Enum,
      ) => {
        if (courseType === Course_Type_Enum.Indirect)
          return (
            t('alias.non-reaccreditation') + ', ' + t('alias.reaccreditation')
          )
        return t(
          `alias.${reaccred ? 'reaccreditation' : 'non-reaccreditation'}`,
        )
      }

      expect(screen.getByText(t('title'))).toBeInTheDocument()
      expect(
        screen.getByText(_t(`course-levels.${pricing.course_level}`)),
      ).toBeInTheDocument()
      expect(
        screen.getByText(_t(`course-types.${pricing.course_type}`)),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          attributesColumn(pricing.reaccred, pricing.course_type),
        ),
      ).toBeInTheDocument()
    })
  })
})
