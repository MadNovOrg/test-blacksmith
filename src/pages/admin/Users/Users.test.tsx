import { build, fake } from '@jackfranklin/test-data-bot'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { GetProfilesQuery } from '@app/generated/graphql'
import useProfiles from '@app/hooks/useProfiles'
import { RoleName } from '@app/types'

import { render, screen, within } from '@test/index'

import { Users } from './Users'

jest.mock('@app/hooks/useProfiles')

const useProfilesMocked = jest.mocked(useProfiles)

const mockProfile = build<GetProfilesQuery['profiles'][0]>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    fullName: fake(f => `${f.name.firstName()} ${f.name.lastName()}`),
    email: fake(f => f.internet.email()),
    avatar: fake(f => f.internet.avatar()),
    roles: [
      {
        role: {
          id: fake(f => f.datatype.uuid()),
          name: RoleName.USER,
        },
      },
    ],
    organizations: [
      {
        id: fake(f => f.datatype.uuid()),
        organization: {
          id: fake(f => f.datatype.uuid()),
          name: fake(f => f.random.word()),
        },
      },
    ],
  },
})

describe('page: Users', () => {
  it('displays a spinner while users are loading', () => {
    useProfilesMocked.mockReturnValue({
      profiles: [],
      isLoading: true,
      count: 0,
      error: undefined,
    })

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    )

    expect(screen.getByTestId('users-fetching')).toBeInTheDocument()
  })

  it('displays no profiles found message', () => {
    useProfilesMocked.mockReturnValue({
      profiles: [],
      isLoading: false,
      count: 0,
      error: undefined,
    })

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    )

    expect(screen.getByText('No users at this time')).toBeInTheDocument()
  })

  it('displays table columns and fields', () => {
    const profile = mockProfile()
    useProfilesMocked.mockReturnValue({
      profiles: [profile],
      isLoading: false,
      count: 0,
      error: undefined,
    })

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>
    )

    const table = screen.getByRole('table')
    const tableHead = within(table).getByTestId('table-head')
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(5)
    expect(within(columnHeaders[0]).getByText('Name')).toBeInTheDocument()
    expect(within(columnHeaders[1]).getByText('Email')).toBeInTheDocument()
    expect(
      within(columnHeaders[2]).getByText('Organisation')
    ).toBeInTheDocument()
    expect(within(columnHeaders[3]).getByText('Role')).toBeInTheDocument()
    expect(
      within(columnHeaders[4]).getByText('Trainer type')
    ).toBeInTheDocument()
    const tableBody = within(table).getByTestId('table-body')
    expect(tableBody.children).toHaveLength(1)
    expect(within(tableBody).getByText(profile.fullName!)).toBeInTheDocument()
    expect(within(tableBody).getByText(profile.email!)).toBeInTheDocument()
    expect(
      within(tableBody).getByText(profile.organizations[0].organization.name)
    ).toBeInTheDocument()
    expect(within(tableBody).getByText('User')).toBeInTheDocument()
  })
})
