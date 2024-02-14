import { format } from 'date-fns'
import { matches } from 'lodash-es'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { never, fromValue } from 'wonka'

import {
  Course_Level_Enum,
  Order_By,
  OrgMembersQuery,
  OrgMembersQueryVariables,
} from '@app/generated/graphql'
import { dateFormats } from '@app/i18n/config'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent, waitFor, within } from '@test/index'

import { MEMBERS_QUERY } from '../../hooks/useOrgMembers'

import { OrgUsersTable } from './OrgUsersTable'

describe(OrgUsersTable.name, () => {
  it('displays loading state while fetching org members', () => {
    const orgId = chance.guid()

    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>
    )

    const membersTable = screen.getByTestId('organisation-members')

    expect(within(membersTable).getByRole('progressbar')).toBeInTheDocument()
  })

  it("displays message when there the organization doesn't have any member", () => {
    const orgId = chance.guid()

    const client = {
      executeQuery: () =>
        fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: [],
            organization_member_aggregate: {
              aggregate: {
                count: 0,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>
    )

    const membersTable = screen.getByTestId('organisation-members')

    expect(
      within(membersTable).getByText(/no users at this time/i)
    ).toBeInTheDocument()
  })

  it('displays organization members within a table', () => {
    const orgId = chance.guid()

    const regularMember = buildOrganizationMember({
      profile: {
        ...buildMemberProfile(),
        go1Licenses: [{ expireDate: new Date().toISOString() }],
        certificates: [
          {
            id: chance.guid(),
            courseLevel: Course_Level_Enum.Level_1,
            status: 'ACTIVE',
          },
        ],
      },
    })
    const adminMember = buildOrganizationMember({ isAdmin: true })

    const members = [regularMember, adminMember]

    const client = {
      executeQuery: ({
        variables,
        query,
      }: {
        variables: OrgMembersQueryVariables
        query: TypedDocumentNode
      }) => {
        const queryMatches = matches({
          query: MEMBERS_QUERY,
          variables: {
            orgId,
          },
        })

        return fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: queryMatches({ query, variables }) ? members : [],
            organization_member_aggregate: {
              aggregate: {
                count: members.length,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>
    )

    const regularMemberRow = screen.getByTestId(
      `org-member-row-${regularMember.id}`
    )

    const certificatesCell = within(regularMemberRow).getByTestId(
      'member-certificates'
    )

    const adminMemberRow = screen.getByTestId(
      `org-member-row-${adminMember.id}`
    )

    members.forEach(member => {
      const memberRow = screen.getByTestId(`org-member-row-${member.id}`)

      expect(
        within(memberRow).getByText(
          member.profile.fullName ?? 'should not pass'
        )
      ).toBeInTheDocument()

      expect(
        within(memberRow).getByTestId('member-last-activity')
      ).toHaveTextContent(
        format(new Date(member.profile.lastActivity), dateFormats.date_default)
      )

      expect(
        within(memberRow).getByTestId('member-created-at')
      ).toHaveTextContent(
        format(new Date(member.profile.createdAt), dateFormats.date_default)
      )
    })

    expect(
      within(regularMemberRow).getByText(/no permissions/i)
    ).toBeInTheDocument()

    expect(
      within(regularMemberRow).getByTestId('CheckCircleIcon')
    ).toBeInTheDocument()

    expect(certificatesCell.textContent).toMatchInlineSnapshot(
      `"ActiveLevel One"`
    )

    expect(
      within(adminMemberRow).getByText(/organisation admin/i)
    ).toBeInTheDocument()
  })

  it("sorts organization members by member's name", async () => {
    const firstMember = buildOrganizationMember()
    const secondMember = buildOrganizationMember()
    const members = [firstMember, secondMember]
    const orgId = chance.guid()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: OrgMembersQueryVariables
      }) => {
        const shouldReverse = !Array.isArray(variables.orderBy)
          ? variables.orderBy?.profile?.fullName === Order_By.Desc
          : false

        return fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: shouldReverse ? members.reverse() : members,
            organization_member_aggregate: {
              aggregate: {
                count: members.length,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>
    )

    const membersTable = screen.getByTestId('organisation-members')

    expect(
      screen.getByTestId(`org-member-row-${firstMember.id}`)
    ).toHaveAttribute('data-index', '0')

    expect(
      screen.getByTestId(`org-member-row-${secondMember.id}`)
    ).toHaveAttribute('data-index', '1')

    await userEvent.click(within(membersTable).getByText(/name/i))

    expect(
      screen.getByTestId(`org-member-row-${firstMember.id}`)
    ).toHaveAttribute('data-index', '1')

    expect(
      screen.getByTestId(`org-member-row-${secondMember.id}`)
    ).toHaveAttribute('data-index', '0')
  })

  it('sorts organization members by last activity', async () => {
    const firstMember = buildOrganizationMember()
    const secondMember = buildOrganizationMember()
    const members = [firstMember, secondMember]
    const orgId = chance.guid()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: OrgMembersQueryVariables
      }) => {
        const shouldReverse = !Array.isArray(variables.orderBy)
          ? variables.orderBy?.profile?.lastActivity === Order_By.Desc
          : false

        return fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: shouldReverse ? members.reverse() : members,
            organization_member_aggregate: {
              aggregate: {
                count: members.length,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>
    )

    const membersTable = screen.getByTestId('organisation-members')
    const lastActivityTableHead =
      within(membersTable).getByText(/last activity/i)

    await userEvent.click(lastActivityTableHead)

    expect(
      screen.getByTestId(`org-member-row-${firstMember.id}`)
    ).toHaveAttribute('data-index', '0')

    expect(
      screen.getByTestId(`org-member-row-${secondMember.id}`)
    ).toHaveAttribute('data-index', '1')

    await userEvent.click(lastActivityTableHead)

    expect(
      screen.getByTestId(`org-member-row-${firstMember.id}`)
    ).toHaveAttribute('data-index', '1')

    expect(
      screen.getByTestId(`org-member-row-${secondMember.id}`)
    ).toHaveAttribute('data-index', '0')
  })

  it('sorts organization members by the data user registered', async () => {
    const firstMember = buildOrganizationMember()
    const secondMember = buildOrganizationMember()
    const members = [firstMember, secondMember]
    const orgId = chance.guid()

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: OrgMembersQueryVariables
      }) => {
        const shouldReverse = !Array.isArray(variables.orderBy)
          ? variables.orderBy?.profile?.createdAt === Order_By.Desc
          : false

        return fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: shouldReverse ? members.reverse() : members,
            organization_member_aggregate: {
              aggregate: {
                count: members.length,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>
    )

    const membersTable = screen.getByTestId('organisation-members')
    const createdAtTableHead = within(membersTable).getByText(/created on/i)

    await userEvent.click(createdAtTableHead)

    expect(
      screen.getByTestId(`org-member-row-${firstMember.id}`)
    ).toHaveAttribute('data-index', '0')

    expect(
      screen.getByTestId(`org-member-row-${secondMember.id}`)
    ).toHaveAttribute('data-index', '1')

    await userEvent.click(createdAtTableHead)

    expect(
      screen.getByTestId(`org-member-row-${firstMember.id}`)
    ).toHaveAttribute('data-index', '1')

    expect(
      screen.getByTestId(`org-member-row-${secondMember.id}`)
    ).toHaveAttribute('data-index', '0')
  })

  it("doesn't display the actions column if a user can't edit organization member", () => {
    const member = buildOrganizationMember()

    const client = {
      executeQuery: () =>
        fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: [member],
            organization_member_aggregate: {
              aggregate: {
                count: 1,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={chance.guid()} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.SALES_REPRESENTATIVE,
        },
      }
    )

    expect(
      within(screen.getByTestId(`org-member-row-${member.id}`)).queryByRole(
        'button',
        { name: /edit/i }
      )
    ).not.toBeInTheDocument()
  })
  ;[RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].forEach(
    roleName => {
      it(`displays the actions column for a ${roleName} role`, async () => {
        const member = buildOrganizationMember()

        const client = {
          executeQuery: () =>
            fromValue<{ data: OrgMembersQuery }>({
              data: {
                members: [member],
                organization_member_aggregate: {
                  aggregate: {
                    count: 1,
                  },
                },
                single_organization_members_count: { aggregate: { count: 0 } },
              },
            }),
        } as unknown as Client

        render(
          <Provider value={client}>
            <OrgUsersTable orgId={chance.guid()} />
          </Provider>,
          {
            auth: {
              activeRole: roleName,
            },
          }
        )

        expect(
          within(screen.getByTestId(`org-member-row-${member.id}`)).getByRole(
            'button',
            { name: /edit/i }
          )
        ).toBeInTheDocument()
      })
    }
  )

  it('displays the actions column to an org admin', () => {
    const member = buildOrganizationMember()
    const orgId = chance.guid()

    const client = {
      executeQuery: () =>
        fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: [member],
            organization_member_aggregate: {
              aggregate: {
                count: 1,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [orgId],
        },
      }
    )

    expect(
      within(screen.getByTestId(`org-member-row-${member.id}`)).getByRole(
        'button',
        { name: /edit/i }
      )
    ).toBeInTheDocument()
  })

  it("displays a dialog with member's data when clicking on the edit button", async () => {
    const member = buildOrganizationMember()
    const orgId = chance.guid()

    const client = {
      executeQuery: () =>
        fromValue<{ data: OrgMembersQuery }>({
          data: {
            members: [member],
            organization_member_aggregate: {
              aggregate: {
                count: 1,
              },
            },
            single_organization_members_count: { aggregate: { count: 0 } },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgUsersTable orgId={orgId} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [orgId],
        },
      }
    )

    await userEvent.click(
      within(screen.getByTestId(`org-member-row-${member.id}`)).getByRole(
        'button',
        { name: /edit/i }
      )
    )

    const dialog = screen.getByRole('dialog')

    expect(
      within(dialog).getByText(
        `Modify permissions for ${member.profile.fullName}`
      )
    ).toBeInTheDocument()

    await userEvent.click(
      within(dialog).getByRole('button', { name: /cancel/i })
    )

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})

function buildMemberProfile(
  overrides?: Partial<OrgMembersQuery['members'][0]['profile']>
): OrgMembersQuery['members'][0]['profile'] {
  return {
    id: chance.guid(),
    fullName: chance.name({ full: true }),
    certificates: [],
    go1Licenses: [],
    lastActivity: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

function buildOrganizationMember(
  overrides?: Partial<OrgMembersQuery['members'][0]>
): OrgMembersQuery['members'][0] {
  return {
    id: chance.guid(),
    isAdmin: false,
    position: undefined,
    ...overrides,
    profile: buildMemberProfile(overrides?.profile),
  }
}
