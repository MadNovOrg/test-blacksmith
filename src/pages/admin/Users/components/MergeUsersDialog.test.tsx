import React from 'react'

import { useFetcher } from '@app/hooks/use-fetcher'
import useProfile from '@app/hooks/useProfile'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import { MergeUsersDialog } from './MergeUsersDialog'

jest.mock('@app/hooks/useProfile')
jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/queries/user/merge-users', () => ({
  MUTATION: 'merge-query',
}))

const useFetcherMock = jest.mocked(useFetcher)
const useProfileMock = jest.mocked(useProfile)

describe('MergeUsersDialog', () => {
  const profileId1 = chance.guid()
  const profileId2 = chance.guid()
  const fetcherMock = jest.fn()
  const onCloseMock = jest.fn()
  const onSuccessMock = jest.fn()

  const setup = () => {
    useFetcherMock.mockReturnValue(fetcherMock)

    const profile1 = {
      profile: {
        id: profileId1,
        updatedAt: new Date('2023-02-01T01:02:03.000Z'),
        avatar: chance.avatar(),
        fullName: chance.name(),
        email: chance.email(),
        organizations: [
          {
            organization: {
              id: chance.guid(),
              name: chance.word(),
            },
          },
        ],
        roles: [
          {
            role: {
              id: chance.guid(),
              name: RoleName.TRAINER,
            },
          },
        ],
      },
      status: LoadingStatus.SUCCESS,
    } as unknown as ReturnType<typeof useProfile>

    const profile2 = {
      profile: {
        id: profileId2,
        updatedAt: new Date('2023-01-01T01:02:03.000Z'),
        avatar: chance.avatar(),
        fullName: chance.name(),
        email: chance.email(),
        organizations: [
          {
            organization: {
              id: chance.guid(),
              name: chance.word(),
            },
          },
        ],
        roles: [
          {
            role: {
              id: chance.guid(),
              name: RoleName.USER,
            },
          },
        ],
      },
      status: LoadingStatus.SUCCESS,
    } as unknown as ReturnType<typeof useProfile>

    useProfileMock.mockImplementation(profileId => {
      if (profileId === profileId1) {
        return profile1
      } else if (profileId === profileId2) {
        return profile2
      }

      return {
        profile: null,
        status: LoadingStatus.ERROR,
      } as unknown as ReturnType<typeof useProfile>
    })

    return render(
      <MergeUsersDialog
        onClose={onCloseMock}
        onSuccess={onSuccessMock}
        profileId1={profileId1}
        profileId2={profileId2}
      />
    )
  }

  it('renders as expected', async () => {
    setup()

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/compare users/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('merge user', async () => {
    fetcherMock.mockResolvedValueOnce({ mergeUser: { success: true } })
    setup()

    await userEvent.click(screen.getByDisplayValue(profileId2))
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith('merge-query', {
      primaryUser: profileId2,
      mergeWith: profileId1,
    })
    expect(onSuccessMock).toHaveBeenCalledTimes(1)
  })

  it('merge error', async () => {
    fetcherMock.mockResolvedValueOnce({ mergeUser: { error: 'some error' } })
    setup()

    await userEvent.click(screen.getByDisplayValue(profileId2))
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith('merge-query', {
      primaryUser: profileId2,
      mergeWith: profileId1,
    })
    expect(onSuccessMock).toHaveBeenCalledTimes(0)

    waitFor(() => {
      expect(screen.getByText(/Unable to merge users/i)).toBeInTheDocument()
    })
  })

  it('cancel merge', async () => {
    setup()

    await userEvent.click(screen.getByDisplayValue(profileId2))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledTimes(0)
  })
})
