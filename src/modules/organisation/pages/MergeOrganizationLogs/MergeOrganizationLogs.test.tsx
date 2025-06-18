import { useTranslation } from 'react-i18next'

import {
  chance,
  render,
  renderHook,
  screen,
  userEvent,
  waitFor,
} from '@test/index'

import { useMergeOrgsLogs } from './hooks/useMergeOrgsLogs'
import { MergeOrganizationLogs } from './MergeOrganizationLogs'

vi.mock('./hooks/useMergeOrgsLogs')
vi.mock('use-query-params', async () => ({
  ...(await vi.importActual('use-query-params')),
  useQueryParam: () => ['', vi.fn()],
  withDefault: vi.fn(),
  StringParam: vi.fn(),
}))
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => vi.fn(),
}))

const mockUseMergeOrgsLogs = vi.mocked(useMergeOrgsLogs)

describe('MergeOrganizationLogs', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const mockLogs: ReturnType<typeof useMergeOrgsLogs>['logs'] = [
    {
      id: '1',
      createdAt: '2023-01-01T00:00:00Z',
      primaryOrganizationId: 'org1',
      primaryOrganization: { id: 'org1', name: 'Primary Org' },
      primaryOrganizationName: '',
      mergedOrganizations: [
        {
          id: chance.guid(),
          organizationId: 'org2',
          organizationName: 'Merged Org 1',
        },
        {
          id: chance.guid(),
          organizationId: 'org3',
          organizationName: 'Merged Org 2',
        },
      ],
      actionedBy: { fullName: 'Admin User' },
      actionedById: 'user1',
    },
  ]

  beforeEach(() => {
    mockUseMergeOrgsLogs.mockReturnValue({
      fetching: false,
      logs: mockLogs,
      total: 1,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with header and tabs', () => {
    render(<MergeOrganizationLogs />)

    expect(
      screen.getByText(t('pages.admin.organizations.title')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.admin.organisations-merge-logs.info')),
    ).toBeInTheDocument()
  })

  it('displays loading state when fetching data', () => {
    mockUseMergeOrgsLogs.mockReturnValue({
      fetching: true,
      logs: [],
      total: undefined,
    })

    render(<MergeOrganizationLogs />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays no rows message when no logs are available', async () => {
    mockUseMergeOrgsLogs.mockReturnValue({
      fetching: false,
      logs: [],
      total: 0,
    })

    render(<MergeOrganizationLogs />)

    await waitFor(() => {
      expect(
        screen.getByText(
          t(`components.table-no-rows.noRecords-first`, {
            itemsName: t('pages.admin.organisations-merge-logs.logs'),
          }),
        ),
      ).toBeInTheDocument()
    })
  })

  it('renders log data correctly', () => {
    render(<MergeOrganizationLogs />)

    expect(screen.getByText('1 January 2023, 12:00 AM')).toBeInTheDocument()
    expect(screen.getByText('Primary Org')).toBeInTheDocument()
    expect(screen.getByText('Merged Org 1 Merged Org 2')).toBeInTheDocument()
    expect(screen.getByText('org2')).toBeInTheDocument()
    expect(screen.getByText('org3')).toBeInTheDocument()
    expect(screen.getByText('Admin User')).toBeInTheDocument()
  })

  it('renders links for primary organization and actioned by user', () => {
    render(<MergeOrganizationLogs />)

    const primaryOrgLink = screen.getByText('Primary Org').closest('a')
    expect(primaryOrgLink).toHaveAttribute('href', '/organisations/org1')

    const userLink = screen.getByText('Admin User').closest('a')
    expect(userLink).toHaveAttribute('href', '/profile/user1')
  })

  it('displays tooltips for merged organization IDs', async () => {
    render(<MergeOrganizationLogs />)

    const org2Cell = screen.getByText('org2')
    await userEvent.hover(org2Cell)

    await waitFor(() => {
      expect(screen.getByText('Merged Org 1')).toBeInTheDocument()
    })
  })

  it('displays the correct column headers', () => {
    render(<MergeOrganizationLogs />)

    expect(
      screen.getByText(t('pages.admin.organisations-merge-logs.created-at')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.admin.organisations-merge-logs.primary-org')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.admin.organisations-merge-logs.merged-orgs')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        t('pages.admin.organisations-merge-logs.merged-orgs-id'),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.admin.organisations-merge-logs.actioned-by')),
    ).toBeInTheDocument()
  })
})
