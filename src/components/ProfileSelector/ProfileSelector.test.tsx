import React from 'react'
import { noop } from 'ts-essentials'

import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY } from '@app/queries/profile/find-profiles'

import { render, screen, userEvent, within, waitFor } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import ProfileSelector from '.'

jest.mock('@app/hooks/use-fetcher')

const useFetcherMock = jest.mocked(useFetcher)

describe('component: ProfileSelector', () => {
  it("doesn't display options initially", () => {
    render(<ProfileSelector onChange={noop} />)

    userEvent.click(screen.getByPlaceholderText('Search for a profile'))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
  })

  it('loads profiles when the user types profile full name', async () => {
    const SEARCH_NAME = 'John Doe'
    const ORG_ID = 'org-id'
    const fetcherMock = jest.fn()

    fetcherMock.mockResolvedValue({
      profiles: [
        buildProfile({
          overrides: {
            givenName: 'John',
            familyName: 'Doe',
          },
        }),
      ],
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(<ProfileSelector onChange={noop} orgId={ORG_ID} />)

    userEvent.type(
      screen.getByPlaceholderText('Search for a profile'),
      SEARCH_NAME
    )

    await waitFor(() => {
      expect(fetcherMock).toHaveBeenCalledTimes(1)
      expect(fetcherMock).toHaveBeenCalledWith(QUERY, {
        where: {
          fullName: { _ilike: `%${SEARCH_NAME}%` },
          organizations: { organization_id: { _eq: ORG_ID } },
        },
      })
      expect(
        within(screen.getByRole('listbox')).getByText(SEARCH_NAME)
      ).toBeInTheDocument()
    })
  })

  it('calls callback when the user makes the selection', async () => {
    const SEARCH_NAME = 'John Doe'
    const ORG_ID = 'org-id'
    const fetcherMock = jest.fn()
    const onChangeMock = jest.fn()
    const profile = buildProfile({
      overrides: {
        givenName: 'John',
        familyName: 'Doe',
      },
    })

    fetcherMock.mockResolvedValue({
      profiles: [profile],
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(<ProfileSelector onChange={onChangeMock} orgId={ORG_ID} />)

    userEvent.type(
      screen.getByPlaceholderText('Search for a profile'),
      SEARCH_NAME
    )

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(SEARCH_NAME)
      ).toBeInTheDocument()
    })

    userEvent.click(within(screen.getByRole('listbox')).getByText(SEARCH_NAME))

    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith(profile)
  })
})
