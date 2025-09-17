import { Resource_Packs_Events_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RoleName } from '@app/types'

import { renderHook, waitFor } from '@test/index'
import { chance, _render, screen, userEvent } from '@test/index'

import {
  ResourcePacksEventCol,
  ResourcePacksEventColProps,
} from './ResourcePacksEventCol'

describe('ResourcePacksEventCol', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation('pages.org-details.tabs.resource-packs.table'),
  )

  it('renders event with invoice number and note', async () => {
    const event: ResourcePacksEventColProps['event'] = {
      event: Resource_Packs_Events_Enum.ResourcePacksAdded,
      payload: {
        invoiceNumber: chance.string(),
        invokedByName: chance.name(),
        note: chance.sentence(),
      },
    }

    _render(<ResourcePacksEventCol event={event} />)

    expect(screen.getByText(event.payload.invoiceNumber)).toBeInTheDocument()

    await userEvent.hover(screen.getByTestId('note-icon'))

    await waitFor(() => {
      expect(screen.getByText(event.payload.note)).toBeInTheDocument()
    })
  })

  it('renders invokedBy correctly for internal user with link', () => {
    const event: ResourcePacksEventColProps['event'] = {
      event: Resource_Packs_Events_Enum.ResourcePacksAdded,
      payload: {
        invoiceNumber: chance.string(),
        invokedByName: chance.name(),
        invokedById: chance.guid(),
        note: chance.sentence(),
      },
    }

    _render(<ResourcePacksEventCol event={event} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    expect(
      screen.getByText(
        t('added-by', {
          fullName: event.payload?.invokedByName,
        }),
      ),
    ).toBeInTheDocument()

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/profile/${event.payload.invokedById}`,
    )
  })

  it('renders invokedBy correctly for non-internal user without link', () => {
    const event: ResourcePacksEventColProps['event'] = {
      event: Resource_Packs_Events_Enum.ResourcePacksAdded,
      payload: {
        invoiceNumber: chance.string(),
        invokedByName: chance.name(),
        invokedById: chance.guid(),
        note: chance.sentence(),
      },
    }

    _render(<ResourcePacksEventCol event={event} />, {
      auth: { activeRole: RoleName.USER },
    })

    expect(
      screen.getByText(
        t('added-by', {
          fullName: event.payload?.invokedByName,
        }),
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders event when no matching event type is found', async () => {
    const event: ResourcePacksEventColProps['event'] = {
      event: 'SomeOtherEvent' as unknown as Resource_Packs_Events_Enum,
      payload: {
        invoiceNumber: chance.string(),
        invokedByName: chance.name(),
        invokedById: chance.guid(),
        note: chance.sentence(),
      },
    }

    _render(<ResourcePacksEventCol event={event} />)

    expect(screen.getByText('SomeOtherEvent')).toBeInTheDocument()
  })
})
