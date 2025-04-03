import { Client, Provider } from 'urql'

import {
  Course_Type_Enum,
  Course_Level_Enum,
  Resource_Packs_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'

import { screen, render, renderHook, chance } from '@test/index'

import { ResourcePacksPricingProvider } from '../../ResourcePacksPricingProvider'

import { EditOrgResourcePacksPricingModal } from '.'

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

describe('component: EditOrgResourcePacksPricingModal', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation(
      'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal',
    ),
  )
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
  const mockClient = {
    executeQuery: vi.fn(),
    executeMutation: vi.fn(),
  } as unknown as Client
  it('should render the component', () => {
    render(
      <Provider value={mockClient}>
        <ResourcePacksPricingProvider>
          <EditOrgResourcePacksPricingModal onClose={vi.fn()} />
        </ResourcePacksPricingProvider>
        ,
      </Provider>,
    )
    expect(screen.getByText(t('title'))).toBeInTheDocument()
  })
})
