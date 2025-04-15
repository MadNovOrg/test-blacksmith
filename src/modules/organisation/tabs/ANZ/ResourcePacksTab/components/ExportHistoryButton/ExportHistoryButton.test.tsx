import { saveAs } from 'file-saver'

import {
  Currency,
  Resource_Packs_Events_Enum,
  Resource_Packs_Type_Enum,
} from '@app/generated/graphql'
import { useAllOrgResourcePacksHistory } from '@app/modules/organisation/queries/get-all-org-resource-packs-history'

import { chance, render, screen, userEvent } from '@test/index'

import { ExportResourcePacksHistoryButton } from '.'

vi.mock('@app/modules/organisation/queries/get-all-org-resource-packs-history')
const useAllOrgResourcePacksHistoryMock = vi.mocked(
  useAllOrgResourcePacksHistory,
)

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))

describe('ExportHistoryButton', () => {
  beforeEach(() => {
    useAllOrgResourcePacksHistoryMock.mockReturnValue({
      data: {
        history: [
          {
            created_at: '2023-01-01T00:00:00Z',
            event: Resource_Packs_Events_Enum.ResourcePacksAdded,
            resourcePacksType: Resource_Packs_Type_Enum.DigitalWorkbook,
            payload: {
              invoiceNumber: '12345',
              note: 'note1',
              invokedByName: 'user1',
              costPerResourcePack: 52,
              currency: Currency.Aud,
            },
            course: {
              id: chance.integer(),
              code: 'course1',
              schedule: [
                {
                  start: '2023-01-01T00:00:00Z',
                },
              ],
            },
            change: 10,
            totalBalance: 100,
            reservedBalance: 50,
            id: chance.guid(),
          },
        ],
      },
      fetching: false,
      error: undefined,
      refetch: () => vi.fn(),
    })
  })
  it('should call saveAs when clicking the button', async () => {
    render(
      <ExportResourcePacksHistoryButton
        orgId={chance.guid()}
        disabled={false}
      />,
    )
    const button = screen.getByTestId('export-resource-pack-history')
    await userEvent.click(button)
    expect(saveAs).toHaveBeenCalled()
  })
})
