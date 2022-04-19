import React from 'react'
import useSWR from 'swr'
import { noop } from 'ts-essentials'

import { render, screen, userEvent, within, waitFor } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { OrgSelector } from '.'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = {
  data: undefined,
  mutate: jest.fn(),
  isValidating: false,
}

describe('component: OrgSelector', () => {
  beforeEach(() => {
    useSWRMock.mockReturnValue({ ...useSWRMockDefaults })
  })

  it("doesn't display options initially", () => {
    render(<OrgSelector onChange={noop} />)

    userEvent.click(screen.getByPlaceholderText('Organisation name'))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('loads organizations when the user types organization name', async () => {
    const ORG_SEARCH_NAME = 'My Org'

    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: {
        orgs: [
          buildOrganization({
            overrides: {
              name: ORG_SEARCH_NAME,
            },
          }),
        ],
      },
    })

    render(<OrgSelector onChange={noop} />)

    userEvent.type(
      screen.getByPlaceholderText('Organisation name'),
      ORG_SEARCH_NAME
    )

    await waitFor(() =>
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
    )
  })

  it('calls callback when the user makes the selection', async () => {
    const ORG_SEARCH_NAME = 'Organization'
    const onChangeMock = jest.fn()
    const organization = buildOrganization({
      overrides: {
        name: ORG_SEARCH_NAME,
      },
    })

    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { orgs: [organization] },
    })

    render(<OrgSelector onChange={onChangeMock} />)

    userEvent.type(
      screen.getByPlaceholderText('Organisation name'),
      ORG_SEARCH_NAME
    )

    await waitFor(() => {
      expect(within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME))
    })

    userEvent.click(
      within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
    )

    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith(organization.id)
  })
})
