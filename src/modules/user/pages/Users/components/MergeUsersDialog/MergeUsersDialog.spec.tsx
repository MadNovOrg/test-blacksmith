import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { MergeUserError, MergeUserMutation } from '@app/generated/graphql'
import useProfile from '@app/modules/profile/hooks/useProfile/useProfile'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import {
  chance,
  _render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@test/index'

import { MergeUsersDialog } from './MergeUsersDialog'

vi.mock('@app/modules/profile/hooks/useProfile/useProfile')

const useProfileMock = vi.mocked(useProfile)

describe(MergeUsersDialog.name, () => {
  const profileId1 = chance.guid()
  const profileId2 = chance.guid()
  const onCloseMock = vi.fn()
  const onSuccessMock = vi.fn()
  const client = {
    executeMutation: vi.fn(),
  }

  const setup = (mockClientValue?: MergeUserMutation) => {
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

    client.executeMutation.mockImplementation(() =>
      fromValue<{ data: MergeUserMutation }>({
        data: mockClientValue as MergeUserMutation,
      }),
    )
    return _render(
      <Provider value={client as unknown as Client}>
        <MergeUsersDialog
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
          profileId1={profileId1}
          profileId2={profileId2}
        />
      </Provider>,
    )
  }

  it('renders as expected', async () => {
    setup()

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/compare users/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('merge user', async () => {
    setup()
    await userEvent.click(screen.getByDisplayValue(profileId2))
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(onSuccessMock).toHaveBeenCalledTimes(1)
  })

  it('merge error', async () => {
    setup({
      mergeUser: { error: 'some error' as MergeUserError, success: false },
    })

    await userEvent.click(screen.getByDisplayValue(profileId2))
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(client.executeMutation).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)

    await waitFor(() => {
      expect(screen.getByText(/Unable to merge users/i)).toBeInTheDocument()
    })
  })

  it('cancel merge', async () => {
    setup()

    await userEvent.click(screen.getByDisplayValue(profileId2))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(client.executeMutation).not.toHaveBeenCalled()
  })
})
