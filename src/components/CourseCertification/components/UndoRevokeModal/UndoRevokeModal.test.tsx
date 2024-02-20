import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { chance, render, screen, userEvent } from '@test/index'

import UndoRevokeModal from './UndoRevokeModal'

vi.mock('@app/hooks/useProfile')

describe('UndoRevokeModal', () => {
  const onCloseMock = vi.fn()
  const onSuccessMock = vi.fn()
  const client = {
    executeQuery: vi.fn(() => never),
    executeMutation: vi.fn(() => never),
    executeSubscription: vi.fn(() => never),
  } as unknown as Client

  const certificateId = chance.guid()
  const participantId = chance.guid()

  it('renders as expected', async () => {
    render(
      <Provider value={client}>
        <UndoRevokeModal
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
          certificateId={certificateId}
          participantId={participantId}
        />
      </Provider>
    )
    expect(
      screen.getByText(/user will regain full access/i)
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)
  })

  it('calls revoke mutation as expected', async () => {
    render(
      <Provider value={client}>
        <UndoRevokeModal
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
          certificateId={certificateId}
          participantId={participantId}
        />
      </Provider>
    )

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(client.executeMutation).toHaveBeenCalledTimes(1)
  })
})
