import { build, perBuild } from '@jackfranklin/test-data-bot'
import { useTranslation } from 'react-i18next'

import {
  GetProfilesQuery,
  GetProfilesQueryVariables,
} from '@app/generated/graphql'
import useProfiles from '@app/hooks/useProfiles'
import { RoleName, TrainerRoleTypeName } from '@app/types'

import {
  render,
  screen,
  within,
  chance,
  userEvent,
  waitFor,
  renderHook,
} from '@test/index'

import { Users } from './Users'

vi.mock('@app/hooks/useProfiles')

const useProfilesMocked = vi.mocked(useProfiles)

const notAllowedRoles = [
  RoleName.FINANCE,
  RoleName.SALES_REPRESENTATIVE,
  RoleName.LD,
]

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
        isAdmin: perBuild(() => chance.bool()),
        organization: {
          id: perBuild(() => chance.guid()),
          name: perBuild(() => chance.word()),
        },
      },
    ],
  },
})

describe('page: Users', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const _t = (col: string) => t(`common.${col}`)

  it('displays a spinner while users are loading', () => {
    useProfilesMocked.mockReturnValue({
      profiles: [],
      isLoading: true,
      count: 0,
      error: undefined,
      mutate: vi.fn(),
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
      mutate: vi.fn(),
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
      mutate: vi.fn(),
    })

    render(<Users />)

    const table = screen.getByRole('table')
    const tableHead = within(table).getByTestId('table-head')
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(7)
    expect(within(columnHeaders[1]).getByText(_t('name'))).toBeInTheDocument()
    expect(within(columnHeaders[2]).getByText(_t('email'))).toBeInTheDocument()
    expect(
      within(columnHeaders[3]).getByText(_t('residing-country'))
    ).toBeInTheDocument()
    expect(
      within(columnHeaders[4]).getByText(_t('organization'))
    ).toBeInTheDocument()
    expect(within(columnHeaders[5]).getByText(_t('role'))).toBeInTheDocument()
    expect(
      within(columnHeaders[6]).getByText(_t('trainer-type'))
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
          mutate: vi.fn(),
        }
      }
    )

    render(<Users />)

    const search = screen.getByTestId('FilterSearch-Input')
    await userEvent.type(search, keyword)
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
          mutate: vi.fn(),
        }
      }
    )

    render(<Users />)

    await userEvent.click(
      within(screen.getByTestId('FilterUserRole')).getByText('Trainer')
    )
    await userEvent.click(
      within(screen.getByTestId('FilterTrainerType')).getByText('Principal')
    )

    await waitFor(() => {
      expect(
        screen.getByText(`${filteredProfile.fullName}`)
      ).toBeInTheDocument()
      expect(screen.queryByText(`${profile.fullName}`)).not.toBeInTheDocument()
    })
  })

  it('filters users by *Organisation Administrator* role', async () => {
    const profile = mockProfile()
    const filteredProfile = mockProfile()

    useProfilesMocked.mockImplementation(
      ({ where }: GetProfilesQueryVariables) => {
        const profiles =
          where?.roles?.role?.name?._in?.includes(RoleName.TRAINER) &&
          where?.organizations?.isAdmin
            ? [filteredProfile]
            : [profile]
        return {
          profiles,
          isLoading: false,
          count: 0,
          error: undefined,
          mutate: vi.fn(),
        }
      }
    )

    render(<Users />)

    await userEvent.click(
      within(screen.getByTestId('FilterUserRole')).getByText('Trainer')
    )
    await userEvent.click(
      within(screen.getByTestId('FilterUserRole')).getByText(
        'Organisation Administrator'
      )
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
          mutate: vi.fn(),
        }
      }
    )

    render(<Users />)

    await userEvent.click(screen.getByLabelText('Moderator'))

    await waitFor(() => {
      expect(
        screen.getByText(`${filteredProfile.fullName}`)
      ).toBeInTheDocument()
      expect(screen.queryByText(`${profile.fullName}`)).not.toBeInTheDocument()
    })
  })

  it('filters archived users', async () => {
    const profile = mockProfile()
    const filteredProfile = mockProfile()

    useProfilesMocked.mockImplementation(
      ({ where }: GetProfilesQueryVariables) => {
        const profiles =
          where?.archived?._eq === true ? [filteredProfile] : [profile]
        return {
          profiles,
          isLoading: false,
          count: 0,
          error: undefined,
          mutate: vi.fn(),
        }
      }
    )

    render(<Users />)

    await userEvent.click(screen.getByLabelText('Archived'))

    await waitFor(() => {
      expect(
        screen.getByText(`${filteredProfile.fullName}`)
      ).toBeInTheDocument()
      expect(screen.queryByText(`${profile.fullName}`)).not.toBeInTheDocument()
    })
  })

  it('filters users by the residing country search', async () => {
    const keyword = chance.word()

    const profile = mockProfile()
    const filteredProfile = mockProfile()

    useProfilesMocked.mockImplementation(
      ({ where }: GetProfilesQueryVariables) => {
        const conditions = where?._or ?? []
        console.log(
          'conditions-------------------------------------------',
          conditions
        )
        const profiles =
          conditions.length >= 3
            ? conditions[3]?.country?._ilike === `%${keyword}%`
              ? [filteredProfile]
              : [profile]
            : [profile]
        return {
          profiles,
          isLoading: false,
          count: 0,
          error: undefined,
          mutate: vi.fn(),
        }
      }
    )

    render(<Users />)

    const search = screen.getByTestId('FilterSearch-Input')
    await userEvent.type(search, keyword)
    await waitFor(() => {
      expect(
        screen.getByText(`${filteredProfile.fullName}`)
      ).toBeInTheDocument()
      expect(screen.queryByText(`${profile.fullName}`)).not.toBeInTheDocument()
    })
  })

  it('navigates to merge page with checkboxes enabled', async () => {
    const profile = mockProfile()
    useProfilesMocked.mockReturnValue({
      profiles: [profile],
      isLoading: false,
      count: 0,
      error: undefined,
      mutate: vi.fn(),
    })

    render(<Users />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    await userEvent.click(screen.getByText('Merge Users'))

    await waitFor(() => {
      expect(screen.getByText('Merge Selected')).toBeInTheDocument()
    })
    expect(screen.getByText('Merge Selected')).toBeDisabled()
  })

  notAllowedRoles.forEach(role =>
    it(`do not renders merge for ${role}`, async () => {
      const profile = mockProfile()
      useProfilesMocked.mockReturnValue({
        profiles: [profile],
        isLoading: false,
        count: 0,
        error: undefined,
        mutate: vi.fn(),
      })

      render(<Users />, {
        auth: {
          activeRole: role,
        },
      })

      await waitFor(() => {
        expect(
          screen.queryByLabelText(/merge selected/i)
        ).not.toBeInTheDocument()
      })
    })
  )

  it('renders merge user page with merge selected button disabled', async () => {
    const profile = mockProfile()
    useProfilesMocked.mockReturnValue({
      profiles: [profile],
      isLoading: false,
      count: 0,
      error: undefined,
      mutate: vi.fn(),
    })

    render(
      <Users />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: ['/users/merge'] }
    )

    await waitFor(() => {
      expect(screen.getByText('Merge Selected')).toBeInTheDocument()
    })

    expect(screen.getByText('Merge Selected')).toBeDisabled()

    const table = screen.getByRole('table')
    const tableBody = within(table).getByTestId('table-body')
    const tableRow = within(tableBody).getByTestId(`row-${profile.id}`)
    const checkbox = within(tableRow).getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('enables merge selected button when exactly 2 users are selected', async () => {
    const profile1 = mockProfile()
    const profile2 = mockProfile()

    useProfilesMocked.mockReturnValue({
      profiles: [profile1, profile2],
      isLoading: false,
      count: 0,
      error: undefined,
      mutate: vi.fn(),
    })

    render(<Users />, {}, { initialEntries: ['/users/merge'] })

    const table = screen.getByRole('table')
    const tableBody = within(table).getByTestId('table-body')
    const row1 = within(tableBody).getByTestId(`row-${profile1.id}`)
    const row2 = within(tableBody).getByTestId(`row-${profile2.id}`)

    expect(screen.getByText('Merge Selected')).toBeDisabled()

    await userEvent.click(within(row1).getByRole('checkbox'))
    expect(screen.getByText('Merge Selected')).toBeDisabled()
    await userEvent.click(within(row2).getByRole('checkbox'))
    expect(screen.getByText('Merge Selected')).toBeEnabled()

    await userEvent.click(screen.getByText('Merge Selected'))

    await waitFor(() => {
      const dialog = screen.getByRole('dialog')

      expect(within(dialog).getByText(/compare users/i)).toBeInTheDocument()
    })
  })
})
