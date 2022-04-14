import React from 'react'
import { noop } from 'ts-essentials'

import { gqlRequest } from '@app/lib/gql-request'
import { QUERY } from '@app/queries/organization/get-organizations'

import { render, screen, userEvent, within, waitFor } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { OrgSelector } from '.'

jest.mock('@app/lib/gql-request')
const gqlRequestMock = jest.mocked(gqlRequest)

describe('component: OrgSelector', () => {
  it("doesn't display options initially", () => {
    render(<OrgSelector onChange={noop} />)

    userEvent.click(screen.getByPlaceholderText('Organisation name'))

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
  })

  it('loads organizations when the user types organization name', async () => {
    const ORG_SEARCH_NAME = 'Organization'

    gqlRequestMock.mockResolvedValue({
      orgs: [
        buildOrganization({
          overrides: {
            name: ORG_SEARCH_NAME,
          },
        }),
      ],
    })

    render(<OrgSelector onChange={noop} />)

    userEvent.type(
      screen.getByPlaceholderText('Organisation name'),
      ORG_SEARCH_NAME
    )

    await waitFor(() => {
      expect(gqlRequestMock).toHaveBeenCalledTimes(1)
      expect(gqlRequestMock).toHaveBeenCalledWith(QUERY, {
        name: `%${ORG_SEARCH_NAME}%`,
      })
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
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

    gqlRequestMock.mockResolvedValue({
      orgs: [organization],
    })

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
