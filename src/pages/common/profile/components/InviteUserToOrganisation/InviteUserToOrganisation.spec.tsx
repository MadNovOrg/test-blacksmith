import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { SaveOrganisationInvitesMutation } from '@app/generated/graphql'
import { useOrganizations } from '@app/hooks/useOrganizations'
import { RoleName } from '@app/types'

import {
  chance,
  render,
  screen,
  userEvent,
  within,
  fireEvent,
} from '@test/index'

import { InviteUserToOrganisation } from '.'

vi.mock('@app/hooks/use-fetcher')
vi.mock('@app/hooks/useOrganizations')

const useOrganisationMock = vi.mocked(useOrganizations)

const orgs = [
  {
    name: chance.name(),
    id: chance.guid(),
  },
  {
    name: chance.name(),
    id: chance.guid(),
  },
]

describe('InviteUserToOrganisation', () => {
  const userProfile = {
    email: chance.email(),
    organizations: [
      {
        organization: {
          id: chance.guid(),
        },
      },
    ],
  }
  const onCloseMock = vi.fn()

  const setup = (client: Client) => {
    const organisations = {
      orgs,
      loading: false,
    } as unknown as ReturnType<typeof useOrganizations>

    useOrganisationMock.mockReturnValue(organisations)

    return render(
      <Provider value={client}>
        <InviteUserToOrganisation
          onClose={onCloseMock}
          userProfile={userProfile}
        />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )
  }

  it('renders as expected', async () => {
    const client = {
      executeMutation: () =>
        fromValue<{ data: SaveOrganisationInvitesMutation }>({
          data: {
            saveOrgInvites: { success: true },
          },
        }),
    } as unknown as Client

    setup(client)

    const dialog = screen.getByTestId('edit-invite-user')
    expect(within(dialog).getByText(/permissions/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Invite user' })).toBeDisabled()
  })

  it('invite user to org if at least one org selected', async () => {
    const client = {
      executeMutation: () =>
        fromValue<{ data: SaveOrganisationInvitesMutation }>({
          data: {
            saveOrgInvites: { success: true },
          },
        }),
    } as unknown as Client

    setup(client)

    const autocomplete = screen.getByTestId('edit-invite-user-org-selector')
    const input = within(autocomplete).getByRole('combobox')
    autocomplete.focus()
    fireEvent.change(input, { target: { value: orgs[0].name } })
    fireEvent.keyDown(autocomplete, { key: 'ArrowDown' })
    fireEvent.keyDown(autocomplete, { key: 'Enter' })

    await userEvent.click(screen.getByRole('button', { name: 'Invite user' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('not invite user to org if there is no selection', async () => {
    const client = {
      executeMutation: () =>
        fromValue<{ data: SaveOrganisationInvitesMutation }>({
          data: {
            saveOrgInvites: { success: true },
          },
        }),
    } as unknown as Client

    setup(client)

    const autocomplete = screen.getByTestId('edit-invite-user-org-selector')
    const input = within(autocomplete).getByRole('combobox')
    autocomplete.focus()
    fireEvent.change(input, { target: { value: orgs[0].name } })
    fireEvent.keyDown(autocomplete, { key: 'ArrowDown' })
    fireEvent.keyDown(autocomplete, { key: 'Esc' })

    expect(screen.getByRole('button', { name: 'Invite user' })).toBeDisabled()

    expect(onCloseMock).toHaveBeenCalledTimes(0)
  })

  it('cancel invite', async () => {
    const client = {
      executeMutation: () =>
        fromValue<{ data: SaveOrganisationInvitesMutation }>({
          data: {
            saveOrgInvites: { success: true },
          },
        }),
    } as unknown as Client

    setup(client)

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
