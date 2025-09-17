import { Client, Provider } from 'urql'

import {
  Course_Type_Enum,
  Course_Level_Enum,
  Resource_Packs_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'
import { CourseTypeOrgRPPricings } from '@app/util'

import { screen, _render, chance } from '@test/index'

import { ResourcePacksPricingProvider } from '../../ResourcePacksPricingProvider'

import { ResourcePacksPricingByLevel } from '.'

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

describe('component: ResourcePacksPricingByLevel', () => {
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
  it.each(CourseTypeOrgRPPricings)(
    'should _render the correct tab for %s',
    courseType => {
      const mockClient = {
        executeQuery: vi.fn(),
        executeMutation: vi.fn(),
      } as unknown as Client

      _render(
        <Provider value={mockClient}>
          <ResourcePacksPricingProvider>
            <ResourcePacksPricingByLevel />
          </ResourcePacksPricingProvider>
          ,
        </Provider>,
      )
      expect(
        screen.getByTestId('resource-packs-pricing-by-course-type'),
      ).toBeInTheDocument()
      expect(
        screen.getByTestId(`resource-packs-pricing-tab-${courseType}`),
      ).toBeInTheDocument()
    },
  )
})
