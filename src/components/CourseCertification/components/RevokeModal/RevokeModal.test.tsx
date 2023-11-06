import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'

import { chance, render, screen, userEvent } from '@test/index'

import RevokeCertModal from './RevokeModal'

vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/use-fetcher')
vi.mock('@app/queries/certificate/revoke-certificate', () => ({
  MUTATION: 'revoke-mutation',
}))

const useFetcherMock = vi.mocked(useFetcher)

describe('RevokeCertModal', () => {
  const fetcherMock = vi.fn()
  const onCloseMock = vi.fn()
  const onSuccessMock = vi.fn()

  const setup = (
    props: { certificateId?: string; participantId?: string } = {}
  ) => {
    useFetcherMock.mockReturnValue(fetcherMock)

    return render(
      <RevokeCertModal
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
        certificateId={props.certificateId || chance.guid()}
        participantId={props.participantId || chance.guid()}
      />
    )
  }

  it('renders as expected', async () => {
    setup()

    expect(
      screen.getByText(/user will no longer have access to the certificate/i)
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)
  })

  it('enforces reason to be present', async () => {
    const certificateId = chance.guid()
    const participantId = chance.guid()

    setup({ certificateId, participantId })

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
    await userEvent.type(
      screen.getByLabelText(/specify reason/i),
      'some reason'
    )

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(fetcherMock).toHaveBeenCalledWith('revoke-mutation', {
      id: certificateId,
      participantId,
      payload: { note: 'some reason' },
    })

    expect(onSuccessMock).toHaveBeenCalled()
    expect(onCloseMock).toHaveBeenCalledTimes(0)
  })
})
