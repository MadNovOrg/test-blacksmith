import React from 'react'
import { noop } from 'ts-essentials'

import { useFetcher } from '@app/hooks/use-fetcher'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildOrganization, buildProfile } from '@test/mock-data-utils'

import { OrgSelector } from '.'

jest.mock('@app/hooks/use-fetcher')
const useFetcherMock = jest.mocked(useFetcher)

describe('component: OrgSelector', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  const profile = buildProfile({
    overrides: {
      organizations: [
        {
          isAdmin: false,
          organization: buildOrganization({
            overrides: {
              id: '1',
              name: 'My Org',
            },
          }),
        },
      ],
    },
  })

  it("doesn't display options initially", async () => {
    render(<OrgSelector onChange={noop} />, { auth: { profile } })

    await userEvent.click(
      screen.getByPlaceholderText('Organisation name', { exact: false })
    )

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('loads organizations when the user types organization name', async () => {
    const ORG_SEARCH_NAME = 'My Org'

    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      orgs: [
        buildOrganization({
          overrides: {
            name: ORG_SEARCH_NAME,
          },
        }),
      ],
    })
    useFetcherMock.mockReturnValue(fetcherMock)

    render(<OrgSelector onChange={noop} />, { auth: { profile } })

    await userEvent.type(
      screen.getByPlaceholderText('Organisation name', { exact: false }),
      ORG_SEARCH_NAME
    )

    jest.runAllTimers()

    await waitFor(() =>
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
    )
  })

  it('should split results based on current user orgs', async () => {
    const orgs = [
      buildOrganization({
        overrides: {
          id: '1',
          name: 'My Org',
        },
      }),
      buildOrganization({
        overrides: {
          id: '2',
          name: 'Other Org',
        },
      }),
    ]
    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({ orgs })
    useFetcherMock.mockReturnValue(fetcherMock)

    render(<OrgSelector onChange={noop} />, { auth: { profile } })

    await userEvent.type(
      screen.getByPlaceholderText('Organisation name', { exact: false }),
      'Org'
    )

    jest.runAllTimers()

    await waitFor(() => {
      const myOrgsGroup = screen.getByTestId(
        'org-selector-result-group-My organisations'
      )
      expect(myOrgsGroup).toBeInTheDocument()
      within(myOrgsGroup).getByTestId(`org-selector-result-${orgs[0].id}`)
      const foundInHubGroup = screen.getByTestId(
        'org-selector-result-group-Found in Team Teach Hub'
      )
      expect(foundInHubGroup).toBeInTheDocument()
      within(foundInHubGroup).getByTestId(`org-selector-result-${orgs[1].id}`)
    })
  })

  it('calls callback when the user makes the selection', async () => {
    const ORG_SEARCH_NAME = 'Organization'
    const onChangeMock = jest.fn()
    const organization = buildOrganization({
      overrides: {
        name: ORG_SEARCH_NAME,
      },
    })

    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      orgs: [organization],
    })
    useFetcherMock.mockReturnValue(fetcherMock)

    render(<OrgSelector onChange={onChangeMock} />, { auth: { profile } })

    await userEvent.type(
      screen.getByPlaceholderText('Organisation name', { exact: false }),
      ORG_SEARCH_NAME
    )

    jest.runAllTimers()

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
    })

    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
    )

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledTimes(1)
      expect(onChangeMock).toHaveBeenCalledWith(organization)
    })
  })
})
