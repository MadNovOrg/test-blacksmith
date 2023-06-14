import React from 'react'
import { noop } from 'ts-essentials'

import { useFetcher } from '@app/hooks/use-fetcher'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import { UserSelector } from '.'

jest.mock('@app/hooks/use-fetcher')
const useFetcherMock = jest.mocked(useFetcher)

describe('component: UserSelector', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
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

    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
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
    })
    useFetcherMock.mockReturnValue(fetcherMock)

    render(
      <UserSelector onChange={noop} onEmailChange={noop} organisationId="1" />
    )

    await userEvent.type(
      screen.getByPlaceholderText('User email'),
      USER_SEARCH_EMAIL
    )

    jest.runAllTimers()

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

    const onChangeMock = jest.fn()
    const profile = {
      id: chance.guid(),
      email: USER_SEARCH_EMAIL,
      familyName: chance.name(),
      givenName: chance.name(),
      fullName: USER_SEARCH_FULL_NAME,
    }

    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      members: [
        {
          profile,
        },
      ],
    })
    useFetcherMock.mockReturnValue(fetcherMock)

    render(
      <UserSelector
        onChange={onChangeMock}
        onEmailChange={noop}
        organisationId="1"
      />
    )

    await userEvent.type(
      screen.getByPlaceholderText('User email'),
      USER_SEARCH_EMAIL
    )

    jest.runAllTimers()

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
