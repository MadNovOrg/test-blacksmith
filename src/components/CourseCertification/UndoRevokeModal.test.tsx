import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'

import { chance, render, screen, userEvent } from '@test/index'

import UndoRevokeModal from './UndoRevokeModal'

jest.mock('@app/hooks/useProfile')
jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/queries/certificate/undo-revoke-certificate', () => ({
  MUTATION: 'undo-revoke-mutation',
}))

const useFetcherMock = jest.mocked(useFetcher)

describe('UndoRevokeModal', () => {
  const fetcherMock = jest.fn()
  const onCloseMock = jest.fn()
  const onSuccessMock = jest.fn()

  const setup = (
    props: { certificateId?: string; participantId?: string } = {}
  ) => {
    useFetcherMock.mockReturnValue(fetcherMock)

    return render(
      <UndoRevokeModal
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
        certificateId={props.certificateId || chance.guid()}
        participantId={props.participantId || chance.guid()}
      />
    )
  }

  it('renders as expected', async () => {
    setup()

    expect(screen.getByText(/undo the revocation/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)
  })

  it('calls undo revoke mutation as expected', async () => {
    const certificateId = chance.guid()
    const participantId = chance.guid()

    setup({ certificateId, participantId })

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(fetcherMock).toHaveBeenCalledWith('undo-revoke-mutation', {
      id: certificateId,
      participantId,
    })

    expect(onSuccessMock).toHaveBeenCalledTimes(1)
    expect(onCloseMock).toHaveBeenCalledTimes(0)
  })
})
