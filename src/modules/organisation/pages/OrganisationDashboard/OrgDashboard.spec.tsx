import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useTranslation } from 'react-i18next'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, _render, renderHook, screen } from '@test/index'

import { useAllOrganizationProfiles } from '../../hooks/useAllOrgMembersProfiles'
import { useIndividualOrganizationStatistics } from '../../hooks/useIndividualOrganizationStatistics'
import { useUpcomingEnrollmentsStats } from '../../hooks/useUpcomingEnrollmentsStats'

import { OrgDashboard } from './OrgDashboard'

vi.mock('../../hooks/useAllOrgMembersProfiles')
vi.mock('../../hooks/useIndividualOrganizationStatistics')
vi.mock('../../hooks/useUpcomingEnrollmentsStats')
vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)
const useAllOrganizationProfilesMocked = vi.mocked(useAllOrganizationProfiles)
const useIndividualOrganizationStatisticsMocked = vi.mocked(
  useIndividualOrganizationStatistics,
)
const useUpcomingEnrollmentsStatsMocked = vi.mocked(useUpcomingEnrollmentsStats)

describe(OrgDashboard.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('renders the component and the external dashboard url', () => {
    const organisationName = chance.name()
    const orgId = chance.guid()
    useFeatureFlagEnabledMock.mockReturnValue(true)
    useAllOrganizationProfilesMocked.mockReturnValue({
      data: {
        organization_member: [],
      },
      error: undefined,
      fetching: false,
    })

    useIndividualOrganizationStatisticsMocked.mockReturnValue({
      data: {
        organizations_statistics: [],
      },
      error: undefined,
      fetching: false,
    })
    useUpcomingEnrollmentsStatsMocked.mockReturnValue({
      data: {
        active_enrollments: {
          aggregate: {
            count: 0,
          },
        },
        expired_recently_enrollments: {
          aggregate: {
            count: 0,
          },
        },
        expiring_soon_enrollments: {
          aggregate: {
            count: 0,
          },
        },
        on_hold_enrollments: {
          aggregate: {
            count: 0,
          },
        },
      },
      error: undefined,
      fetching: false,
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsQuery }>({
          data: {
            orgs: [
              {
                name: organisationName,
                id: orgId,
                external_dashboard_url: 'https://test.com',
              },
              {
                name: 'Name',
                id: '456',
              },
            ],
            orgsCount: 2,
            specificOrg: [
              {
                name: organisationName,
                id: orgId,
                external_dashboard_url: 'https://test.com',
              },
            ],
          } as unknown as GetOrganisationDetailsQuery,
        }),
    } as unknown as Client

    _render(
      <Provider value={client}>
        <Routes>
          <Route path="organisations/:id" element={<OrgDashboard />} />
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/organisations/${orgId}`] },
    )

    expect(screen.getByTestId('org-title')).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.org-details.insight-reports')),
    ).toBeInTheDocument()
  })
})
