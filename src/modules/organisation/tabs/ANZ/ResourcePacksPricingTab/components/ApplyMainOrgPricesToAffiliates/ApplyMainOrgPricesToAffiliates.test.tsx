import { renderHook } from '@testing-library/react'
import { useParams } from 'react-router-dom'
import { Client, Provider } from 'urql'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'
import { useGetAllAffiliatedOrgIds } from '@app/modules/organisation/hooks/useGetAllAffiliatedOrgIds'

import { chance, render, screen, userEvent } from '@test/index'

import { ResourcePacksPricingProvider } from '../../ResourcePacksPricingProvider'
import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'

import { ApplyMainOrgRPPricingToAffiliates } from '.'

vi.mock('@app/modules/organisation/hooks/useAllResourcePacksPricing')
const useAllResourcePacksPricingMock = vi.mocked(useAllResourcePacksPricing)

vi.mock(
  '@app/modules/organisation/tabs/ANZ/ResourcePacksPricingTab/ResourcePacksPricingProvider/useResourcePacksPricingContext',
)
const useResourcePacksPricingContextMock = vi.mocked(
  useResourcePacksPricingContext,
)

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
  }
})
const applyMainOrgRPPricingToAffiliatesMock = vi.fn().mockResolvedValue({
  data: {
    delete_org_resource_packs_pricing: {
      affected_rows: 1,
    },
    insert_org_resource_packs_pricing: {
      affected_rows: 1,
    },
  },
})

vi.mock(
  '@app/modules/organisation/hooks/useApplyOrgResourcePacksPriceOnAffiliates',
  async () => {
    const actual = await vi.importActual(
      '@app/modules/organisation/hooks/useApplyOrgResourcePacksPriceOnAffiliates',
    )
    return {
      ...actual,
      useApplyOrgResourcePacksPriceOnAffiliates: () => [
        {
          fetching: false,
          error: undefined,
        },
        applyMainOrgRPPricingToAffiliatesMock,
      ],
    }
  },
)

const useParamsMock = vi.mocked(useParams)

const resourcePackPricings = [
  {
    id: chance.guid(),
    course_type: Course_Type_Enum.Closed,
    course_level: Course_Level_Enum.Level_1,
    resource_packs_type: Resource_Packs_Type_Enum.DigitalWorkbook,
    resource_packs_delivery_type: null,
    org_resource_packs_pricings: [
      {
        id: chance.guid(),
        AUD_price: 50,
        NZD_price: 55,
      },
    ],
    org_resource_packs_pricings_aggregate: {
      aggregate: {
        count: 0,
      },
      nodes: [],
    },
    reaccred: false,
    AUD_price: 52,
    NZD_price: 56,
  },
]
const pricings = resourcePackPricings.flatMap(item => {
  if (item.org_resource_packs_pricings?.length) {
    return item.org_resource_packs_pricings.map(value => ({
      id: value.id,
      resource_packs_pricing_id: item.id,
      AUD_price: value.AUD_price,
      NZD_price: value.NZD_price,
    }))
  }
  return []
})
const affiliatesIds = [chance.guid(), chance.guid()]
vi.mock('@app/modules/organisation/hooks/useGetAllAffiliatedOrgIds')
const mockGetAllAffiliatedOrgIdsMock = vi.mocked(useGetAllAffiliatedOrgIds)

describe('component: ApplyMainOrgPricesToAffiliates', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation(
      'pages.org-details.tabs.resource-pack-pricing.apply-price-to-affiliates',
    ),
  )

  const mockClient = {
    executeQuery: vi.fn(),
    executeMutation: vi.fn(),
  } as unknown as Client

  const setup = () => {
    return render(
      <Provider value={mockClient}>
        <ResourcePacksPricingProvider>
          <ApplyMainOrgRPPricingToAffiliates />
        </ResourcePacksPricingProvider>
      </Provider>,
    )
  }

  beforeEach(() => {
    useParamsMock.mockReturnValue({
      id: 'orgId',
    })
    useAllResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: resourcePackPricings,
      },
      error: undefined,
      fetching: false,
      refetch: vi.fn(),
    })
    useResourcePacksPricingContextMock.mockReturnValue({
      orgResourcePacksPricings: pricings,
      fetching: false,
      refetch: vi.fn(),
      main_organisation_id: null,
      differentPricesFromMain: false,
      groupedData: [],
      pricing: null,
      setSelectedPricing: vi.fn(),
      error: undefined,
      affiliatesIds: affiliatesIds,
      refetchAffiliatesIds: vi.fn(),
      fetchingAffiliatesIds: false,
    })
    mockGetAllAffiliatedOrgIdsMock.mockReturnValue({
      data: affiliatesIds.map(id => ({
        id,
      })),
      error: undefined,
      fetching: false,
      refetch: vi.fn(),
    })
  })

  it('should render the button', () => {
    setup()
    expect(
      screen.getByTestId('apply-main-org-prices-to-affiliates'),
    ).toBeInTheDocument()
  })

  it('should render the modal when the button is clicked', async () => {
    setup()
    const button = screen.getByTestId('apply-main-org-prices-to-affiliates')
    await userEvent.click(button)
    expect(screen.getByText(t('modal.title'))).toBeVisible()
  })
  it('should close the modal when the cancel button is clicked', async () => {
    setup()
    const button = screen.getByTestId('apply-main-org-prices-to-affiliates')
    await userEvent.click(button)
    const cancelButton = screen.getByText(t('modal.cancel-button'))
    await userEvent.click(cancelButton)
    expect(screen.queryByText(t('modal.title'))).not.toBeVisible()
  })
  it('should call the applyMainOrgRPPricingToAffiliates function when the confirm button is clicked', async () => {
    setup()
    const button = screen.getByTestId('apply-main-org-prices-to-affiliates')
    await userEvent.click(button)
    const confirmButton = screen.getByText(t('modal.confirm-button'))
    await userEvent.click(confirmButton)
    expect(applyMainOrgRPPricingToAffiliatesMock).toHaveBeenCalled()
    expect(applyMainOrgRPPricingToAffiliatesMock).toHaveBeenCalledWith({
      affiliatesIds,
      pricings: [
        {
          organisation_id: affiliatesIds[0],
          resource_packs_pricing_id: resourcePackPricings[0].id,
          AUD_price:
            resourcePackPricings[0].org_resource_packs_pricings[0].AUD_price,
          NZD_price:
            resourcePackPricings[0].org_resource_packs_pricings[0].NZD_price,
        },
        {
          organisation_id: affiliatesIds[1],
          resource_packs_pricing_id: resourcePackPricings[0].id,
          AUD_price:
            resourcePackPricings[0].org_resource_packs_pricings[0].AUD_price,
          NZD_price:
            resourcePackPricings[0].org_resource_packs_pricings[0].NZD_price,
        },
      ],
    })
  })
})
