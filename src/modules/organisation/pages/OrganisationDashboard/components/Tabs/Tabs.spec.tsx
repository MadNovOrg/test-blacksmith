import { useFeatureFlagEnabled } from 'posthog-js/react'

import { AwsRegions, RoleName } from '@app/types'

import { _render, screen } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { Tabs } from './Tabs'

const commonTabsTestIds = [
  'org-overview',
  'org-details',
  'org-individuals',
  'org-blended-licences',
]

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe(Tabs.name, () => {
  useFeatureFlagEnabledMock.mockReturnValue(true)
  const commonTest = (tab: string, region: AwsRegions) => {
    vi.stubEnv('VITE_AWS_REGION', region)
    _render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId(tab)).toBeInTheDocument()
  }

  it('should _render the component', () => {
    _render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId('org-overview')).toBeInTheDocument()
  })
  it.each(commonTabsTestIds)('should _render coomon tabs on anz %s', tab => {
    commonTest(tab, AwsRegions.Australia)
  })
  it.each(commonTabsTestIds)('should _render coomon tabs on uk %s', tab => {
    commonTest(tab, AwsRegions.UK)
  })
  it('should not _render the affiliated tab on UK', () => {
    _render(<Tabs organization={buildOrganization()} />)
    expect(screen.queryByTestId('affiliated-orgs')).not.toBeInTheDocument()
  })
  it('should _render the affiliated tab on AU', () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
    _render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId('affiliated-orgs')).toBeInTheDocument()
  })
  it('should _render the resource packs tab on AU', () => {
    commonTest('org-resource-packs', AwsRegions.Australia)
  })
  it('should not _render the resource packs tab on UK', () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
    _render(<Tabs organization={buildOrganization()} />)
    expect(screen.queryByTestId('org-resource-packs')).not.toBeInTheDocument()
  })
  it.each([RoleName.TT_ADMIN, RoleName.TT_OPS])(
    'should _render the permissions tab for allowed roles -- %s role',
    role => {
      _render(<Tabs organization={buildOrganization()} />, {
        auth: {
          activeRole: role,
        },
      })
      expect(screen.getByTestId('org-permissions')).toBeInTheDocument()
    },
  )
  it.each([
    ...Object.values(RoleName).filter(
      role => role !== RoleName.TT_ADMIN && role !== RoleName.TT_OPS,
    ),
  ])(
    'should not _render the permissions tab for roles without permissions -- %s role',
    role => {
      _render(<Tabs organization={buildOrganization()} />, {
        auth: {
          activeRole: role,
        },
      })
      expect(screen.queryByTestId('org-permissions')).not.toBeInTheDocument()
    },
  )
  it('should switch tabs on tab click', () => {
    _render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId('org-overview')).toBeInTheDocument()
    screen.getByTestId('org-details').click()
    expect(screen.getByTestId('org-details')).toBeInTheDocument()
  })
  const resourcePacksPricingAllowedRoles = [
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.FINANCE,
    RoleName.SALES_ADMIN,
  ]

  it.each(resourcePacksPricingAllowedRoles)(
    'should _render org resource packs pricing tab for role --%s',
    role => {
      vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
      _render(<Tabs organization={buildOrganization()} />, {
        auth: {
          activeRole: role,
        },
      })
      expect(
        screen.getByTestId('org-resource-packs-pricing'),
      ).toBeInTheDocument()
    },
  )

  it.each(
    Object.values(RoleName).filter(
      role => !resourcePacksPricingAllowedRoles.includes(role),
    ),
  )(
    'should not _render org resource packs pricing tab for role -- %s',
    role => {
      vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)

      _render(<Tabs organization={buildOrganization()} />, {
        auth: {
          activeRole: role,
        },
      })
      expect(
        screen.queryByTestId('org-resource-packs-pricing'),
      ).not.toBeInTheDocument()
    },
  )
})
