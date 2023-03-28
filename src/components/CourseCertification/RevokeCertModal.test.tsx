import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'

import { chance, render, screen, userEvent } from '@test/index'

import RevokeCertModal from './RevokeCertModal'

jest.mock('@app/hooks/useProfile')
jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/queries/certificate/revoke-certificate', () => ({
  MUTATION: 'revoke-mutation',
}))

const useFetcherMock = jest.mocked(useFetcher)

describe('RevokeCertModal', () => {
  const fetcherMock = jest.fn()
  const onCloseMock = jest.fn()
  const onSuccessMock = jest.fn()

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
      screen.getByText(/revoke access for this certificate/i)
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)
  })

  it('calls revoke mutation as expected', async () => {
    const certificateId = chance.guid()
    const participantId = chance.guid()

    setup({ certificateId, participantId })

    await userEvent.click(screen.getByLabelText(/reason for revok/i))
    await userEvent.click(screen.getByText(/bad behaviour/i))

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(fetcherMock).toHaveBeenCalledWith('revoke-mutation', {
      id: certificateId,
      participantId,
      payload: { note: 'BAD_BEHAVIOUR' },
    })

    expect(onSuccessMock).toHaveBeenCalledTimes(1)
    expect(onCloseMock).toHaveBeenCalledTimes(0)
  })

  it('enforces custom text to be present when reason is "OTHER"', async () => {
    const certificateId = chance.guid()
    const participantId = chance.guid()

    setup({ certificateId, participantId })

    await userEvent.click(screen.getByRole('checkbox'))

    await userEvent.click(screen.getByLabelText(/reason for revok/i))
    await userEvent.click(screen.getByText(/OTHER/i))

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
      payload: { note: 'OTHER - some reason' },
    })

    expect(onSuccessMock).toHaveBeenCalled()
    expect(onCloseMock).toHaveBeenCalledTimes(0)
  })
})
