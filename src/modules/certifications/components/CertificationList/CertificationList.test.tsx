import {} from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  GetCourseParticipantsOrganizationsQuery,
  Grade_Enum,
} from '@app/generated/graphql'
import { RoleName, SortOrder } from '@app/types'

import {
  render,
  screen,
  within,
  userEvent,
  waitFor,
  renderHook,
} from '@test/index'
import {
  buildCertificate,
  buildOrganization,
  buildParticipant,
  buildProfile,
} from '@test/mock-data-utils'

import {
  CertificationList,
  CertificationListColumns,
} from './CertificationList'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

describe('component: CertificationList', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const sorting = {
    by: 'name',
    dir: 'asc' as SortOrder,
    onSort: vi.fn(),
  }
  const columns = [
    'name',
    'certificate',
    'course-code',
    'status',
    'date-obtained',
    'date-expired',
    'organisation',
    'contact',
  ] as CertificationListColumns

  it('renders default columns', async () => {
    const participants = [buildParticipant()]
    const sorting = {
      by: 'name',
      dir: 'asc' as SortOrder,
      onSort: vi.fn(),
    }

    render(<CertificationList participants={participants} sorting={sorting} />)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(7)
    expect(within(columnHeaders[1]).getByText('Name')).toBeInTheDocument()
    expect(within(columnHeaders[2]).getByText('Email')).toBeInTheDocument()
    expect(
      within(columnHeaders[3]).getByText('Organisation'),
    ).toBeInTheDocument()
    expect(within(columnHeaders[4]).getByText('Grade')).toBeInTheDocument()
    expect(within(columnHeaders[5]).getByText('Status')).toBeInTheDocument()
  })

  it('can render admin columns and fields', async () => {
    const participant = buildParticipant()
    participant.certificate = buildCertificate()
    participant.grade = Grade_Enum.Pass
    const participants = [participant]

    render(
      <CertificationList
        participants={participants}
        sorting={sorting}
        columns={columns}
      />,
    )

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    const tableHead = within(table).getByTestId('table-head')
    expect(tableHead).toBeInTheDocument()
    const columnHeaders = within(tableHead).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(10)
    expect(within(columnHeaders[1]).getByText('Name')).toBeInTheDocument()
    expect(within(columnHeaders[2]).getByText('Email')).toBeInTheDocument()
    expect(
      within(columnHeaders[3]).getByText('Organisation'),
    ).toBeInTheDocument()
    expect(
      within(columnHeaders[4]).getByText('Certificate'),
    ).toBeInTheDocument()
    expect(
      within(columnHeaders[5]).getByText('Course code'),
    ).toBeInTheDocument()
    expect(within(columnHeaders[6]).getByText('Status')).toBeInTheDocument()
    const tableBody = within(table).getByTestId('table-body')
    expect(tableBody).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.profile.fullName),
    ).toBeInTheDocument()
    expect(within(tableBody).getByText('Pass')).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.certificate.number),
    ).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.course.course_code),
    ).toBeInTheDocument()
    expect(
      within(tableBody).getByText(participant.course.course_code),
    ).toBeInTheDocument()
    expect(within(tableBody).getByText('Active')).toBeInTheDocument()
  })

  it('checks the download selected certificates is disabled without selecting certificates', async () => {
    const participants = [buildParticipant()]
    const sorting = {
      by: 'name',
      dir: 'asc' as SortOrder,
      onSort: vi.fn(),
    }

    render(<CertificationList participants={participants} sorting={sorting} />)

    expect(
      screen.getByTestId('download-all-certifications'),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('download-selected-certifications'),
    ).toBeDisabled()
    await userEvent.click(screen.getByTestId('TableChecks-Head'))
    expect(screen.getByTestId('download-selected-certifications')).toBeEnabled()
  })

  it('displays search filter', () => {
    const participant = buildParticipant()
    participant.certificate = buildCertificate()
    participant.grade = Grade_Enum.Pass
    const participants = [participant]

    render(
      <CertificationList
        participants={participants}
        sorting={sorting}
        columns={columns}
      />,
    )
    const searchFilter = screen.getByTestId('FilterSearch-Input')

    expect(searchFilter).toBeInTheDocument()
  })

  it('displays organization dropdown', () => {
    const participant = buildParticipant()
    participant.certificate = buildCertificate()
    participant.grade = Grade_Enum.Pass
    const participants = [participant]

    render(
      <CertificationList
        participants={participants}
        sorting={sorting}
        columns={columns}
      />,
    )
    const searchFilter = screen.getByTestId('attendee-organization-dropdown')

    expect(searchFilter).toBeInTheDocument()
  })

  it('displays all participants organizations in Organization Dropdown', async () => {
    const participants = [
      buildParticipant({
        overrides: {
          grade: Grade_Enum.Pass,
          profile: buildProfile({
            overrides: {
              organizations: [
                {
                  organization: buildOrganization({
                    overrides: {
                      name: 'NearForm',
                    },
                  }),
                  isAdmin: false,
                },
              ],
            },
          }),
        },
      }),
      buildParticipant({
        overrides: {
          profile: buildProfile({
            overrides: {
              organizations: [
                {
                  organization: buildOrganization({
                    overrides: {
                      name: 'Amdaris',
                    },
                  }),
                  isAdmin: false,
                },
              ],
            },
          }),
          grade: Grade_Enum.Pass,
          healthSafetyConsent: true,
        },
      }),
      buildParticipant({
        overrides: {
          profile: buildProfile({
            overrides: {
              organizations: [
                {
                  organization: buildOrganization({
                    overrides: {
                      name: 'Team Teach',
                    },
                  }),
                  isAdmin: false,
                },
              ],
            },
          }),
          grade: Grade_Enum.Pass,
          healthSafetyConsent: false,
          completed_evaluation: true,
        },
      }),
    ]

    const client = {
      executeQuery: () =>
        fromValue<{ data: GetCourseParticipantsOrganizationsQuery }>({
          data: {
            course_participant: [
              {
                profile: {
                  organizations: [
                    {
                      organization: {
                        name: 'Amdaris',
                      },
                    },
                    {
                      organization: {
                        name: 'Team Teach',
                      },
                    },
                    {
                      organization: {
                        name: 'NearForm',
                      },
                    },
                  ],
                },
              },
            ],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <CertificationList
          participants={participants}
          sorting={sorting}
          columns={columns}
        />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
    )
    const orgNames = participants
      ?.flatMap(cp =>
        cp.profile.organizations.map(org => org.organization.name),
      )
      .filter(Boolean)

    const organizationDropdown = screen.getByLabelText(
      t('components.organization-dropdown.title'),
    )

    userEvent.click(organizationDropdown)
    await waitFor(() => {
      orgNames.forEach(name => {
        expect(
          screen.queryByTestId(`organization-option-${name}`),
        ).toBeInTheDocument()
      })
    })
  })
  it.each([RoleName.TT_ADMIN, RoleName.TT_OPS])(
    'allows updating certifications for %s',
    async role => {
      const participant = buildParticipant()
      participant.certificate = buildCertificate()
      participant.grade = Grade_Enum.Pass
      const participants = [participant]

      render(
        <CertificationList
          participants={participants}
          sorting={sorting}
          columns={columns}
        />,
        {
          auth: {
            activeRole: role,
          },
        },
      )

      expect(
        screen.getByTestId('manage-selected-certifications'),
      ).toBeInTheDocument()

      expect(screen.getAllByTestId('TableChecks-Row')).toHaveLength(
        participants.length,
      )

      await userEvent.click(screen.getByTestId('TableChecks-Row'))

      await userEvent.click(
        screen.getByTestId('manage-selected-certifications'),
      )

      expect(
        screen.getByText(
          t('components.certification-list.update-certifications'),
        ),
      ).toBeInTheDocument()

      await userEvent.click(
        screen.getByText(
          t('components.certification-list.update-certifications'),
        ),
      )

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/certifications/edit', {
        state: {
          courseId: participant.course.id,
          participants: new Set([participant.id]),
        },
      })
    },
  )
  it('doesnt allow trainers to update certifications', async () => {
    const participant = buildParticipant()
    participant.certificate = buildCertificate()
    participant.grade = Grade_Enum.Pass
    const participants = [participant]

    render(
      <CertificationList
        participants={participants}
        sorting={sorting}
        columns={columns}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      },
    )

    expect(
      screen.queryByTestId('manage-selected-certifications'),
    ).not.toBeInTheDocument()
  })
})
