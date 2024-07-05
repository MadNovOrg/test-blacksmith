import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { DeleteProfileMutation, DeleteUserError } from '@app/generated/graphql'
import useProfile from '@app/modules/profile/hooks/useProfile'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import { ProfileDeleteDialog } from '.'

vi.mock('@app/modules/profile/hooks/useProfile')
const useProfileMock = vi.mocked(useProfile)

describe('DeleteUsersDialog', () => {
  const mockClient = {
    executeMutation: vi.fn(() => never),
  }
  mockClient.executeMutation.mockImplementation(() =>
    fromValue<{ data: DeleteProfileMutation }>({
      data: { deleteUser: { success: true } },
    }),
  )
  const profileId = chance.guid()
  const onCloseMock = vi.fn()
  const onSuccessMock = vi.fn()

  const setup = (client?: { executeMutation: () => void }) => {
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
      <Provider value={(client ?? mockClient) as unknown as Client}>
        <ProfileDeleteDialog
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
          profileId={profileId}
        />
      </Provider>,
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
    setup()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('delete user', async () => {
    setup()
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(mockClient.executeMutation).toHaveBeenCalledTimes(2)
    expect(onSuccessMock).toHaveBeenCalledTimes(1)
  })

  it('delete error', async () => {
    const client = {
      executeMutation: vi.fn(() => never),
    }
    client.executeMutation.mockImplementationOnce(() =>
      fromValue<{ data: DeleteProfileMutation }>({
        data: {
          deleteUser: {
            success: false,
            error: 'some error' as DeleteUserError,
          },
        },
      }),
    )
    setup(client)

    expect(screen.getByRole('checkbox')).not.toBeVisible()
    expect(client.executeMutation).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)

    waitFor(() => {
      expect(
        screen.getByText(/An error occurred while deleting the user./i),
      ).toBeInTheDocument()
    })
  })

  it('cancel delete', async () => {
    setup()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onSuccessMock).toHaveBeenCalledTimes(0)
  })
})
