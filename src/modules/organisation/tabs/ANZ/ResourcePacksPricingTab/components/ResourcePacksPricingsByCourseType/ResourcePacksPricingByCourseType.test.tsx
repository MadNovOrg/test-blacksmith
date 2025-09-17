import { Client, CombinedError, Provider } from 'urql'

import {
  Course_Type_Enum,
  Course_Level_Enum,
  Resource_Packs_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'
import { CourseTypeOrgRPPricings } from '@app/util'

import { chance, _render, renderHook, screen } from '@test/index'

import { ResourcePacksPricingProvider } from '../../ResourcePacksPricingProvider'
import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'

import {
  GroupedResourcePacksPricing,
  ResourcePacksPricingByCourseType,
} from '.'

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

const groupedResourcePacksPricings = pricings.map(
  p =>
    ({
      key: `${p.course_type}-${p.course_level}-${p.reaccred}`,
      courseType: p.course_type,
      courseLevel: p.course_level,
      reaccred: p.reaccred,
      values: [p],
    } as GroupedResourcePacksPricing),
)

describe('component: ResourcePacksPricingByCourseType', () => {
  const {
    result: {
      current: { t, _t },
    },
  } = renderHook(() =>
    useScopedTranslation(
      'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type',
    ),
  )

  const attributesColumn = (
    reaccred: boolean,
    courseType: Course_Type_Enum,
  ) => {
    if (courseType === Course_Type_Enum.Indirect)
      return (
        t('table.alias.non-reaccreditation') +
        ', ' +
        t('table.alias.reaccreditation')
      )
    return t(
      `table.alias.${reaccred ? 'reaccreditation' : 'non-reaccreditation'}`,
    )
  }
  beforeEach(() => {
    useAllResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: undefined,
      fetching: false,
      refetch: () => vi.fn(),
    })
  })

  CourseTypeOrgRPPricings.forEach(courseType => {
    it(`should not _render pricings table if there was an error fetching prices for course type: ${courseType}`, () => {
      useResourcePacksPricingContextMock.mockReturnValueOnce({
        groupedData: groupedResourcePacksPricings,
        fetching: false,
        setSelectedPricing: vi.fn(),
        error: new CombinedError({
          networkError: new Error('Network error'),
        }),
        refetch: vi.fn(),
        pricing: null,
        main_organisation_id: null,
        orgResourcePacksPricings: [],
        affiliatesIds: [],
        refetchAffiliatesIds: vi.fn(),
        fetchingAffiliatesIds: false,
      } as unknown as ReturnType<typeof useResourcePacksPricingContext>)
      const mockClient = {
        executeQuery: vi.fn(),
        executeMutation: vi.fn(),
      } as unknown as Client

      _render(
        <Provider value={mockClient}>
          <ResourcePacksPricingProvider>
            <ResourcePacksPricingByCourseType courseType={courseType} />
          </ResourcePacksPricingProvider>
        </Provider>,
      )

      expect(
        screen.queryByTestId('resource-packs-pricing-table'),
      ).not.toBeInTheDocument()
    })

    it(`should _render resource packs pricings table for course type: ${courseType}`, async () => {
      const pricingToCheck = groupedResourcePacksPricings.find(
        pricing => pricing.courseType === courseType,
      ) as GroupedResourcePacksPricing

      useResourcePacksPricingContextMock.mockReturnValueOnce({
        groupedData: groupedResourcePacksPricings,
        fetching: false,
        setSelectedPricing: vi.fn(),
        error: undefined,
        refetch: vi.fn(),
        pricing: null,
        main_organisation_id: null,
        orgResourcePacksPricings: [],
        affiliatesIds: [],
        refetchAffiliatesIds: vi.fn(),
        fetchingAffiliatesIds: false,
      } as unknown as ReturnType<typeof useResourcePacksPricingContext>)
      const mockClient = {
        executeQuery: vi.fn(),
        executeMutation: vi.fn(),
      } as unknown as Client

      _render(
        <Provider value={mockClient}>
          <ResourcePacksPricingProvider>
            <ResourcePacksPricingByCourseType courseType={courseType} />
          </ResourcePacksPricingProvider>
        </Provider>,
      )

      expect(
        screen.getByTestId('resource-packs-pricing-table'),
      ).toBeInTheDocument()
      expect(
        screen.getByText(_t(`course-levels.${pricingToCheck.courseLevel}`)),
      )
      expect(
        screen.getByText(_t(`course-types.${pricingToCheck.courseType}`)),
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          attributesColumn(pricingToCheck.reaccred, pricingToCheck.courseType),
        ),
      ).toBeInTheDocument()
    })

    it(`should _render EditOrgResourcePacksPricingsModal if there is a selected pricing for course type: ${courseType}`, () => {
      const pricingToCheck = groupedResourcePacksPricings.find(
        pricing => pricing.courseType === courseType,
      ) as GroupedResourcePacksPricing
      useResourcePacksPricingContextMock.mockReturnValue({
        groupedData: groupedResourcePacksPricings,
        fetching: false,
        setSelectedPricing: vi.fn(),
        error: undefined,
        refetch: vi.fn(),
        pricing: pricingToCheck,
        main_organisation_id: null,
        orgResourcePacksPricings: [],
        affiliatesIds: [],
        refetchAffiliatesIds: vi.fn(),
        fetchingAffiliatesIds: false,
      } as unknown as ReturnType<typeof useResourcePacksPricingContext>)
      const mockClient = {
        executeQuery: vi.fn(),
        executeMutation: vi.fn(),
      } as unknown as Client

      _render(
        <Provider value={mockClient}>
          <ResourcePacksPricingProvider>
            <ResourcePacksPricingByCourseType courseType={courseType} />
          </ResourcePacksPricingProvider>
        </Provider>,
      )

      expect(
        screen.getByTestId('edit-org-resource-packs-pricing-modal'),
      ).toBeInTheDocument()
    })
  })
})
