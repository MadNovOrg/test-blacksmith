import { noop } from 'ts-essentials'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { FindProfilesQuery } from '@app/generated/graphql'

import { render, screen, userEvent, within, waitFor } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { ProfileSelector } from '.'

describe('component: ProfileSelector', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it("doesn't display options initially", async () => {
    render(<ProfileSelector onChange={noop} />)

    await userEvent.click(screen.getByPlaceholderText('Search for a profile'))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
  })

  it('loads profiles when the user types profile full name', async () => {
    const SEARCH_NAME = 'John Doe'
    const ORG_ID = 'org-id'

    const client = {
      executeQuery: () =>
        fromValue<{ data: FindProfilesQuery }>({
          data: {
            profiles: [
              buildProfile({
                overrides: {
                  givenName: 'John',
                  familyName: 'Doe',
                },
              }) as unknown as FindProfilesQuery['profiles'][0],
            ],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ProfileSelector onChange={noop} orgId={ORG_ID} />
      </Provider>
    )

    await userEvent.type(
      screen.getByPlaceholderText('Search for a profile'),
      SEARCH_NAME
    )

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(SEARCH_NAME)
      ).toBeInTheDocument()
    })
  })

  it('calls callback when the user makes the selection', async () => {
    const SEARCH_NAME = 'John Doe'
    const ORG_ID = 'org-id'
    const onChangeMock = vi.fn()
    const client = {
      executeQuery: () =>
        fromValue<{ data: FindProfilesQuery }>({
          data: {
            profiles: [
              buildProfile({
                overrides: {
                  givenName: 'John',
                  familyName: 'Doe',
                },
              }) as unknown as FindProfilesQuery['profiles'][0],
            ],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <ProfileSelector onChange={onChangeMock} orgId={ORG_ID} />
      </Provider>
    )

    await userEvent.type(
      screen.getByPlaceholderText('Search for a profile'),
      SEARCH_NAME
    )

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(SEARCH_NAME)
      ).toBeInTheDocument()
    })

    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(SEARCH_NAME)
    )

    expect(onChangeMock).toHaveBeenCalledTimes(1)
  })
})
