import { render, screen } from '@testing-library/react'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Resource_Packs_Delivery_Type_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'

import { useOrgResourcePacksPricingGetChangeEvent } from './hooks/use-org-resource-packs-pricing-change-event'
import { useOrgResourcePacksPricingChangelogs } from './hooks/use-org-resource-packs-pricing-changelogs'
import { useResourcePacksPricingAttributes } from './hooks/use-resource-packs-pricing-attributes'

import { ResourcePacksPricingChangelogs } from '.'

vi.mock('./hooks/use-org-resource-packs-pricing-changelogs')
vi.mock('./hooks/use-org-resource-packs-pricing-change-event')
vi.mock('./hooks/use-resource-packs-pricing-attributes')

const mockUseOrgResourcePacksPricingChangelogs = vi.mocked(
  useOrgResourcePacksPricingChangelogs,
)
const mockUseOrgResourcePacksPricingGetChangeEvent = vi.mocked(
  useOrgResourcePacksPricingGetChangeEvent,
)
const mockUseResourcePacksPricingAttributes = vi.mocked(
  useResourcePacksPricingAttributes,
)

const mockOnClose = vi.fn()
const baseProps = {
  onClose: mockOnClose,
  open: true,
  orgId: 'org-123',
  resourcePacksPricingIds: ['id-1'],
}

describe('ResourcePacksPricingChangelogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading spinner when loading', () => {
    mockUseOrgResourcePacksPricingChangelogs.mockReturnValue({
      changelogs: [],
      loading: true,
      resourcePacksPricingCommonDetails: null as unknown as ReturnType<
        typeof useOrgResourcePacksPricingChangelogs
      >['resourcePacksPricingCommonDetails'],
      totalCount: 0,
    })

    render(<ResourcePacksPricingChangelogs {...baseProps} />)

    expect(
      screen.getByTestId('list-orders-circular-progress'),
    ).toBeInTheDocument()
  })

  it('shows no rows message when not loading and changelogs is empty', () => {
    mockUseOrgResourcePacksPricingChangelogs.mockReturnValue({
      changelogs: [],
      loading: false,
      resourcePacksPricingCommonDetails: {
        id: 'common-details',
        course_level: Course_Level_Enum.Level_1,
        course_type: Course_Type_Enum.Open,
        reaccred: true,
      },
      totalCount: 0,
    })
    mockUseResourcePacksPricingAttributes.mockReturnValue(
      () => 'Mocked Attributes',
    )

    render(<ResourcePacksPricingChangelogs {...baseProps} />)

    expect(screen.getByTestId('table-body')).toHaveTextContent(
      'components.table-no-rows.noRecords-first',
    )
  })

  it('renders changelog rows', () => {
    mockUseOrgResourcePacksPricingChangelogs.mockReturnValue({
      changelogs: [
        {
          id: '1',
          actioned_at: '2024-01-01T00:00:00Z',
          updated_columns: ['price'],
          actioned_by_profile: { id: 'profile-1', fullName: 'John Doe' },
          resource_packs_pricing: {
            course_type: Course_Type_Enum.Indirect,
            resource_packs_type: Resource_Packs_Type_Enum.PrintWorkbook,
            resource_packs_delivery_type:
              Resource_Packs_Delivery_Type_Enum.Standard,
          },
        },
      ] as unknown as ReturnType<
        typeof useOrgResourcePacksPricingChangelogs
      >['changelogs'],
      loading: false,
      resourcePacksPricingCommonDetails: {
        id: 'common-details',
        course_level: Course_Level_Enum.Level_1,
        course_type: Course_Type_Enum.Open,
        reaccred: false,
      },
      totalCount: 1,
    })
    mockUseResourcePacksPricingAttributes.mockReturnValue(
      () => 'Mocked Attributes',
    )
    mockUseOrgResourcePacksPricingGetChangeEvent.mockReturnValue(
      () => 'Price updated',
    )

    render(<ResourcePacksPricingChangelogs {...baseProps} />)

    expect(screen.getByText('Price updated')).toBeInTheDocument()
  })
})
