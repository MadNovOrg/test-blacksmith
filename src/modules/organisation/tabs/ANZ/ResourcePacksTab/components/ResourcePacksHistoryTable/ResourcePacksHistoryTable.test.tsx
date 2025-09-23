import {
  GetOrgResourcePacksHistoryQuery,
  Resource_Packs_Events_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useOrgResourcePacksHistory } from '@app/modules/organisation/queries/get-org-resource-packs-history'

import { renderHook, waitFor } from '@test/index'
import { chance, _render, screen } from '@test/index'

import { ResourcePacksHistoryTable } from '.'

vi.mock('@app/modules/organisation/queries/get-org-resource-packs-history')

const useOrgResourcePacksHistoryMocked = vi.mocked(useOrgResourcePacksHistory)

describe('ResourcePacksHistoryTable', () => {
  const {
    result: {
      current: { t, _t },
    },
  } = renderHook(() =>
    useScopedTranslation('pages.org-details.tabs.resource-packs.table'),
  )

  it('renders the table with headers correctly', () => {
    useOrgResourcePacksHistoryMocked.mockReturnValue([
      {
        data: { history: [], total: { aggregate: { count: 0 } } },
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    _render(<ResourcePacksHistoryTable orgId={chance.guid()} />)

    expect(screen.getByText(t('col-date'))).toBeInTheDocument()
    expect(screen.getByText(t('col-event'))).toBeInTheDocument()
    expect(screen.getByText(t('col-option'))).toBeInTheDocument()
    expect(screen.getByText(t('col-amount'))).toBeInTheDocument()
    expect(screen.getByText(t('col-balance'))).toBeInTheDocument()
    expect(screen.getByText(t('col-reserved-balance'))).toBeInTheDocument()
  })

  it('renders data when fetched', async () => {
    const data: GetOrgResourcePacksHistoryQuery['history'] = [
      {
        id: chance.guid(),
        change: 10,
        course: {
          id: chance.integer(),
          createdBy: {
            id: chance.guid(),
            fullName: chance.name(),
          },
        },
        created_at: chance.date().toISOString(),
        event: Resource_Packs_Events_Enum.ResourcePacksAdded,
        payload: {
          invoiceNumber: chance.string(),
          invokedByName: chance.name(),
          note: chance.sentence(),
        },
        reservedBalance: 50,
        resourcePacksType: Resource_Packs_Type_Enum.PrintWorkbook,
        totalBalance: 100,
      },
    ]

    useOrgResourcePacksHistoryMocked.mockReturnValue([
      {
        data: { history: data, total: { aggregate: { count: data.length } } },
        fetching: false,
        stale: false,
      },
      vi.fn(),
    ])

    _render(<ResourcePacksHistoryTable orgId={chance.guid()} />)

    await waitFor(() => {
      expect(
        screen.getByText(
          _t('dates.defaultShort', {
            date: data[0].created_at,
          }),
        ),
      ).toBeInTheDocument()
      expect(
        screen.getByText(t(`event.${data[0].resourcePacksType}`)),
      ).toBeInTheDocument()
      expect(screen.getByText(`+${data[0].change}`)).toBeInTheDocument()
      expect(screen.getByText(data[0].totalBalance)).toBeInTheDocument()
      expect(screen.getByText(data[0].reservedBalance)).toBeInTheDocument()
    })
  })
})
