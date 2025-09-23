import { useParams } from 'react-router-dom'
import { Client, Provider } from 'urql'

import {
  Course_Type_Enum,
  Course_Level_Enum,
  Resource_Packs_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useAllResourcePacksPricing } from '@app/modules/organisation/hooks/useAllResourcePacksPricing'
import { RoleName } from '@app/types'
import { CurrencySymbol } from '@app/util'

import {
  chance,
  _render,
  renderHook,
  screen,
  userEvent,
  waitFor,
} from '@test/index'

import { ResourcePacksPricingProvider } from '../../ResourcePacksPricingProvider'
import { useResourcePacksPricingContext } from '../../ResourcePacksPricingProvider/useResourcePacksPricingContext'
import { GroupedResourcePacksPricing } from '../ResourcePacksPricingsByCourseType'

import { OrgResourcePacksPricingTable } from '.'

vi.mock('@app/modules/organisation/hooks/useAllResourcePacksPricing')
const useAllResourcePacksPricingMock = vi.mocked(useAllResourcePacksPricing)

vi.mock(
  '@app/modules/organisation/tabs/ANZ/ResourcePacksPricingTab/ResourcePacksPricingProvider/useResourcePacksPricingContext',
)
const useResourcePacksPricingContextMock = vi.mocked(
  useResourcePacksPricingContext,
)

const upsertOrgResourcePacksPricingMock = vi.fn().mockResolvedValue({
  data: {
    update_org_resource_packs_pricing_by_pk: {
      id: chance.guid(),
    },
  },
})

const allowedRoles = [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.FINANCE]

vi.mock(
  '@app/modules/organisation/hooks/useOrgResourcePacksPricing',
  async () => {
    const actual = await vi.importActual(
      '@app/modules/organisation/hooks/useOrgResourcePacksPricing',
    )
    return {
      ...actual,
      useUpsertOrgResourcePacksPricing: () => [
        {
          fetching: false,
          data: {
            insert_org_resource_packs_pricing_one: {
              id: chance.guid(),
            },
          },
          error: undefined,
        },
        upsertOrgResourcePacksPricingMock,
      ],
    }
  },
)

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
  }
})

const useParamsMock = vi.mocked(useParams)

const refetchMock = vi.fn()

const courseType = Course_Type_Enum.Indirect
const courseLevel = Course_Level_Enum.Level_1
const reaccred = false
const orgId = chance.guid()
const pricings = [
  {
    id: chance.guid(),
    course_type: courseType,
    course_level: courseLevel,
    resource_packs_type: Resource_Packs_Type_Enum.DigitalWorkbook,
    resource_packs_delivery_type: null,
    org_resource_packs_pricings: [],
    org_resource_packs_pricings_aggregate: {
      aggregate: {
        count: 0,
      },
      nodes: [],
    },
    reaccred: reaccred,
    AUD_price: 52,
    NZD_price: 56,
  },
  {
    id: chance.guid(),
    course_type: courseType,
    course_level: courseLevel,
    resource_packs_type: Resource_Packs_Type_Enum.PrintWorkbook,
    resource_packs_delivery_type: Resource_Packs_Delivery_Type_Enum.Standard,
    org_resource_packs_pricings: [
      {
        id: chance.guid(),
        AUD_price: 40,
        NZD_price: 45,
      },
    ],
    org_resource_packs_pricings_aggregate: {
      aggregate: {
        count: 1,
      },
      nodes: [],
    },
    reaccred: reaccred,
    AUD_price: 45,
    NZD_price: 50,
  },
  {
    id: chance.guid(),
    course_type: courseType,
    course_level: courseLevel,
    resource_packs_type: Resource_Packs_Type_Enum.PrintWorkbook,
    resource_packs_delivery_type: Resource_Packs_Delivery_Type_Enum.Express,
    reaccred: reaccred,
    org_resource_packs_pricings: [],
    org_resource_packs_pricings_aggregate: {
      aggregate: {
        count: 0,
      },
      nodes: [],
    },
    AUD_price: 50,
    NZD_price: 55,
  },
]

const groupedResourcePacksPricing = {
  key: `${courseType}-${courseLevel}-${false}`,
  courseType: courseType,
  courseLevel: courseLevel,
  reaccred: reaccred,
  values: pricings,
} as GroupedResourcePacksPricing

const getNumberWithDigits = (number: number | string) =>
  Number(number).toFixed(2)

describe('component: OrgResourcePacksPricingsTable', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation(
      'pages.org-details.tabs.resource-pack-pricing.prices-by-course-type.edit-pricing-modal.org-resource-packs-pricing-table',
    ),
  )

  const mockClient = {
    executeQuery: vi.fn(),
    executeMutation: vi.fn(),
  } as unknown as Client

  const setup = () => {
    return _render(
      <Provider value={mockClient}>
        <ResourcePacksPricingProvider>
          <OrgResourcePacksPricingTable />
        </ResourcePacksPricingProvider>
      </Provider>,
      {
        auth: {
          activeRole: chance.pickone(allowedRoles),
        },
      },
    )
  }
  beforeEach(() => {
    useParamsMock.mockReturnValue({ id: orgId })

    useAllResourcePacksPricingMock.mockReturnValue({
      data: {
        resource_packs_pricing: pricings,
      },
      error: undefined,
      fetching: false,
      refetch: refetchMock,
    })

    useResourcePacksPricingContextMock.mockReturnValue({
      pricing: groupedResourcePacksPricing,
      fetching: false,
      refetch: refetchMock,
      groupedData: [groupedResourcePacksPricing],
      setSelectedPricing: () => vi.fn(),
      error: undefined,
      main_organisation_id: null,
      orgResourcePacksPricings: [],
      affiliatesIds: [],
      refetchAffiliatesIds: vi.fn(),
      fetchingAffiliatesIds: false,
    } as unknown as ReturnType<typeof useResourcePacksPricingContext>)
  })

  it('should _render the OrgResourcePacksPricingsTable with the pricings', () => {
    setup()
    const table = screen.getByTestId(`resource-packs-pricing-table-${orgId}`)
    expect(table).toBeInTheDocument()

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(1 + pricings.length) // header row + data rows

    pricings.forEach((pricing, index) => {
      const row = rows[index + 1] // skip header row
      expect(row).toHaveTextContent(
        // Resource pack option
        t(
          `resource_packs_types.${pricing.course_type}.${
            pricing.resource_packs_type
          }${
            pricing.course_type === Course_Type_Enum.Indirect &&
            pricing.resource_packs_type !==
              Resource_Packs_Type_Enum.DigitalWorkbook
              ? '.' + pricing.resource_packs_delivery_type
              : ''
          }`,
        ) +
          // Price (AUD)
          `${CurrencySymbol[Currency.Aud]}${getNumberWithDigits(
            pricing.org_resource_packs_pricings[0]?.AUD_price ??
              pricing.AUD_price,
          )}` +
          // Price (NZD)
          `${CurrencySymbol[Currency.Nzd]}${getNumberWithDigits(
            pricing.org_resource_packs_pricings[0]?.NZD_price ??
              pricing.NZD_price,
          )}`,
      )
      expect(row).toContainElement(
        screen.getByTestId(`edit-pricing-${pricing.id}`),
      )
    })
  })

  it('should display text fields with existing price values when clicking edit button', async () => {
    setup()
    const pricingToCheck = pricings[0]

    const editButton = screen.getByTestId(`edit-pricing-${pricingToCheck.id}`)
    expect(editButton).toBeInTheDocument()
    await userEvent.click(editButton)

    const priceAUDInput = screen.getByTestId(
      `edit-aud-price-${pricingToCheck.id}`,
    )

    const cancelEditButton = screen.getByTestId(
      `cancel-pricing-${pricingToCheck.id}`,
    )

    await waitFor(() => {
      expect(priceAUDInput).toBeVisible()
      expect(priceAUDInput).toHaveDisplayValue(
        pricingToCheck.AUD_price.toFixed(2),
      )
    })
    expect(cancelEditButton).toBeVisible()

    await userEvent.click(cancelEditButton)

    expect(priceAUDInput).not.toBeInTheDocument()
  })

  it('should display snackbar with error message if either input price is lower than or equal to 0', async () => {
    setup()
    const pricingToCheck = pricings[0]
    const editButton = screen.getByTestId(`edit-pricing-${pricingToCheck.id}`)
    expect(editButton).toBeInTheDocument()
    await userEvent.click(editButton)
    const saveButton = screen.getByTestId(`save-pricing-${pricingToCheck.id}`)
    expect(saveButton).toBeInTheDocument()

    const priceNZDInput = screen.getByTestId(
      `edit-nzd-price-${pricingToCheck.id}`,
    )
    waitFor(() => {
      expect(priceNZDInput).toBeVisible()
    })
    await userEvent.clear(priceNZDInput)
    await userEvent.type(priceNZDInput, '0')
    await userEvent.click(saveButton)
    const snackbar = screen.getByTestId('snackbar-message')

    await waitFor(() => {
      expect(snackbar).toBeVisible()
      expect(snackbar).toHaveTextContent(
        t('validation-errors.price-amount-required'),
      )
    })
  })

  it('should call updateOrgResourcePacksPricing if the org pricing did exist', async () => {
    setup()
    const pricingToEdit = pricings[1] // This pricing has org_resource_packs_pricings
    const editButton = screen.getByTestId(`edit-pricing-${pricingToEdit.id}`)
    expect(editButton).toBeInTheDocument()
    await userEvent.click(editButton)

    const saveButton = screen.getByTestId(`save-pricing-${pricingToEdit.id}`)
    expect(saveButton).toBeInTheDocument()

    const priceNZDInput = screen.getByTestId(
      `edit-nzd-price-${pricingToEdit.id}`,
    )
    await waitFor(() => {
      expect(priceNZDInput).toBeVisible()
    })
    await userEvent.clear(priceNZDInput)
    await userEvent.type(priceNZDInput, '100')
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(upsertOrgResourcePacksPricingMock).toHaveBeenCalledTimes(1)
      expect(upsertOrgResourcePacksPricingMock).toHaveBeenCalledWith({
        AUD_price: pricingToEdit.org_resource_packs_pricings[0].AUD_price,
        NZD_price: 100,
        organisation_id: orgId,
        resource_packs_pricing_id: pricingToEdit.id,
      })
      expect(refetchMock).toHaveBeenCalled()
    })
  })
})
