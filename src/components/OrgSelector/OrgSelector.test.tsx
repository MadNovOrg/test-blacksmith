import React from 'react'
import { noop } from 'ts-essentials'

import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY } from '@app/queries/organization/get-organizations'

import { render, screen, userEvent, within, waitFor } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { OrgSelector } from '.'

jest.mock('@app/hooks/use-fetcher')

const useFetcherMock = jest.mocked(useFetcher)

describe('component: OrgSelector', () => {
  it("doesn't display options initially", () => {
    render(<OrgSelector onChange={noop} />)

    userEvent.click(screen.getByPlaceholderText('Organisation name'))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
  })

  it('loads organizations when the user types organization name', async () => {
    const ORG_SEARCH_NAME = 'Organization'
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

    render(<OrgSelector onChange={noop} />)

    userEvent.type(
      screen.getByPlaceholderText('Organisation name'),
      ORG_SEARCH_NAME
    )

    await waitFor(() => {
      expect(fetcherMock).toHaveBeenCalledTimes(1)
      expect(fetcherMock).toHaveBeenCalledWith(QUERY, {
        name: `%${ORG_SEARCH_NAME}%`,
      })
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
    })
  })

  it('calls callback when the user makes the selection', async () => {
    const ORG_SEARCH_NAME = 'Organization'
    const fetcherMock = jest.fn()
    const onChangeMock = jest.fn()
    const organization = buildOrganization({
      overrides: {
        name: ORG_SEARCH_NAME,
      },
    })

    fetcherMock.mockResolvedValue({
      orgs: [organization],
    })

    useFetcherMock.mockReturnValue(fetcherMock)

    render(<OrgSelector onChange={onChangeMock} />)

    userEvent.type(
      screen.getByPlaceholderText('Organisation name'),
      ORG_SEARCH_NAME
    )

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
    })

    userEvent.click(
      within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
    )

    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith(organization)
  })
})
