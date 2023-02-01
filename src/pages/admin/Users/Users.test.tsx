import { build, perBuild } from '@jackfranklin/test-data-bot'
import React from 'react'

import {
  GetProfilesQuery,
  GetProfilesQueryVariables,
} from '@app/generated/graphql'
import useProfiles from '@app/hooks/useProfiles'
import { RoleName, TrainerRoleTypeName } from '@app/types'

import { render, screen, within, chance, userEvent, waitFor } from '@test/index'

import { Users } from './Users'

jest.mock('@app/hooks/useProfiles')

const useProfilesMocked = jest.mocked(useProfiles)

const mockProfile = build<
  Exclude<GetProfilesQuery['profiles'], undefined | null>[0]
>({
  fields: {
    id: perBuild(() => chance.guid()),
    fullName: perBuild(() => chance.name({ full: true })),
    email: perBuild(() => chance.email()),
    avatar: perBuild(() => chance.avatar()),
    roles: [
      {
        role: {
          id: perBuild(() => chance.guid()),
          name: RoleName.USER,
        },
      },
    ],
    trainer_role_types: [
      {
        trainer_role_type: {
          id: perBuild(() => chance.guid()),
          name: TrainerRoleTypeName.PRINCIPAL,
        },
      },
    ],
    organizations: [
      {
        organization: {
          id: perBuild(() => chance.guid()),
          name: perBuild(() => chance.word()),
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

    render(<Users />)

    expect(screen.getByTestId('users-fetching')).toBeInTheDocument()
  })

  it('displays no profiles found message', () => {
    useProfilesMocked.mockReturnValue({
      profiles: [],
      isLoading: false,
      count: 0,
      error: undefined,
    })

    render(<Users />)

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

    render(<Users />)

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
    expect(
      within(tableBody).getByText(profile.fullName ?? '')
    ).toBeInTheDocument()

    expect(within(tableBody).getByText(profile.email ?? '')).toBeInTheDocument()

    expect(
      within(tableBody).getByText(profile.organizations[0].organization.name)
    ).toBeInTheDocument()
    expect(within(tableBody).getByText('Individual')).toBeInTheDocument()
    expect(within(tableBody).getByText('Principal')).toBeInTheDocument()
  })

  it('filters users by organisation search', async () => {
    const keyword = chance.word()

    const profile = mockProfile()
    const filteredProfile = mockProfile()

    useProfilesMocked.mockImplementation(
      ({ where }: GetProfilesQueryVariables) => {
        const conditions = where?._or ?? []
        const profiles =
          conditions[0]?.organizations?.organization?.name?._ilike ===
          `%${keyword}%`
            ? [filteredProfile]
            : [profile]
        return {
          profiles,
          isLoading: false,
          count: 0,
          error: undefined,
        }
      }
    )

    render(<Users />)

    const search = screen.getByTestId('FilterSearch-Input')
    userEvent.type(search, keyword)
    await waitFor(() => {
      expect(
        screen.getByText(`${filteredProfile.fullName}`)
      ).toBeInTheDocument()
      expect(screen.queryByText(`${profile.fullName}`)).not.toBeInTheDocument()
    })
  })

  it('filters users by role and trainer type', async () => {
    const profile = mockProfile()
    const filteredProfile = mockProfile()

    useProfilesMocked.mockImplementation(
      ({ where }: GetProfilesQueryVariables) => {
        const profiles =
          where?.roles?.role?.name?._in?.includes(RoleName.TRAINER) &&
          where?.trainer_role_types?.trainer_role_type?.name?._in?.includes(
            TrainerRoleTypeName.PRINCIPAL
          )
            ? [filteredProfile]
            : [profile]
        return {
          profiles,
          isLoading: false,
          count: 0,
          error: undefined,
        }
      }
    )

    render(<Users />)

    userEvent.click(
      within(screen.getByTestId('FilterUserRole')).getByText('Trainer')
    )
    userEvent.click(
      within(screen.getByTestId('FilterTrainerType')).getByText('Principal')
    )

    await waitFor(() => {
      expect(
        screen.getByText(`${filteredProfile.fullName}`)
      ).toBeInTheDocument()
      expect(screen.queryByText(`${profile.fullName}`)).not.toBeInTheDocument()
    })
  })

  it('filters users by moderator', async () => {
    const profile = mockProfile()
    const filteredProfile = mockProfile()

    useProfilesMocked.mockImplementation(
      ({ where }: GetProfilesQueryVariables) => {
        const profiles =
          where?.trainer_role_types?.trainer_role_type?.name?._eq ===
          TrainerRoleTypeName.MODERATOR
            ? [filteredProfile]
            : [profile]
        return {
          profiles,
          isLoading: false,
          count: 0,
          error: undefined,
        }
      }
    )

    render(<Users />)

    userEvent.click(screen.getByLabelText('Moderator'))

    await waitFor(() => {
      expect(
        screen.getByText(`${filteredProfile.fullName}`)
      ).toBeInTheDocument()
      expect(screen.queryByText(`${profile.fullName}`)).not.toBeInTheDocument()
    })
  })
})
