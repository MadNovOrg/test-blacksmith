import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'
import useProfile from '@app/hooks/useProfile'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import { ProfileDeleteDialog } from '.'

vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/use-fetcher')
vi.mock('@app/queries/profile/delete-profile', () => ({
  MUTATION: 'delete-query',
}))

const useFetcherMock = vi.mocked(useFetcher)
const useProfileMock = vi.mocked(useProfile)

describe('DeleteUsersDialog', () => {
  const profileId = chance.guid()
  const fetcherMock = vi.fn()
  const onCloseMock = vi.fn()
  const onSuccessMock = vi.fn()

  const setup = () => {
    useFetcherMock.mockReturnValue(fetcherMock)

    const profile = {
      profile: {
        givenName: chance.first(),
        familyName: chance.last(),
        email: chance.email(),
      },
      status: LoadingStatus.SUCCESS,
    } as unknown as ReturnType<typeof useProfile>

    useProfileMock.mockReturnValue(profile)

    return render(
      <ProfileDeleteDialog
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
        profileId={profileId}
      />
    )
  }

  it('renders as expected', async () => {
    setup()

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/delete user/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('allows delete only after confirmation checkbox is checked', async () => {
    fetcherMock.mockResolvedValueOnce({ deleteUser: { success: true } })
    setup()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('delete user', async () => {
    fetcherMock.mockResolvedValue({ deleteUser: { success: true } })
    setup()
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(fetcherMock).toHaveBeenCalledTimes(2)

    expect(onSuccessMock).toHaveBeenCalledTimes(1)
  })

  it('delete error', async () => {
    fetcherMock.mockResolvedValueOnce({ deleteUser: { error: 'some error' } })
    setup()

    expect(screen.getByRole('checkbox')).not.toBeVisible()

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith('delete-query', {
      profileId,
      dryRun: true,
    })

    expect(onSuccessMock).toHaveBeenCalledTimes(0)

    waitFor(() => {
      expect(
        screen.getByText(/An error occurred while deleting the user./i)
      ).toBeInTheDocument()
    })
  })

  it('cancel delete', async () => {
    setup()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)
    expect(fetcherMock).toHaveBeenCalledTimes(1)
  })
})
