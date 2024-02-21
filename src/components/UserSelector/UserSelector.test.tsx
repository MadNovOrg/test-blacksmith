import { noop } from 'ts-essentials'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GetOrgMembersQuery } from '@app/generated/graphql'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import { UserSelector } from '.'

describe('component: UserSelector', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it("doesn't display options initially", async () => {
    render(
      <UserSelector onChange={noop} onEmailChange={noop} organisationId="1" />
    )

    await userEvent.click(screen.getByPlaceholderText('User email'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('loads users when the user types user email', async () => {
    const USER_SEARCH_EMAIL = 'USER_EMAIL'
    const USER_SEARCH_FULL_NAME = chance.name()
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrgMembersQuery }>({
          data: {
            members: [
              {
                profile: {
                  id: chance.guid(),
                  email: USER_SEARCH_EMAIL,
                  familyName: chance.name(),
                  givenName: chance.name(),
                  fullName: USER_SEARCH_FULL_NAME,
                },
              },
            ],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <UserSelector onChange={noop} onEmailChange={noop} organisationId="1" />
      </Provider>
    )

    await userEvent.type(
      screen.getByPlaceholderText('User email'),
      USER_SEARCH_EMAIL
    )

    await waitFor(() =>
      expect(
        within(screen.getByRole('listbox')).getByText(
          `${USER_SEARCH_EMAIL}, ${USER_SEARCH_FULL_NAME}`
        )
      ).toBeInTheDocument()
    )
  })

  it('calls callback when the user makes the selection of a user', async () => {
    const USER_SEARCH_EMAIL = 'USER_EMAIL'
    const USER_SEARCH_FULL_NAME = chance.name()
    const profile = {
      id: chance.guid(),
      email: USER_SEARCH_EMAIL,
      familyName: chance.name(),
      givenName: chance.name(),
      fullName: USER_SEARCH_FULL_NAME,
    }

    const onChangeMock = vi.fn()
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrgMembersQuery }>({
          data: {
            members: [{ profile }],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <UserSelector
          onChange={onChangeMock}
          onEmailChange={noop}
          organisationId="1"
        />
      </Provider>
    )

    await userEvent.type(
      screen.getByPlaceholderText('User email'),
      USER_SEARCH_EMAIL
    )

    vi.runAllTimers()

    const optionLabel = `${USER_SEARCH_EMAIL}, ${USER_SEARCH_FULL_NAME}`

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(optionLabel)
      ).toBeInTheDocument()
    })

    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(optionLabel)
    )

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledTimes(1)
      expect(onChangeMock).toHaveBeenCalledWith(profile)
    })
  })
})
