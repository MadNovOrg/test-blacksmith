import { Routes, Route } from 'react-router-dom'

import { AwsRegions, RoleName } from '@app/types'

import { render, screen } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import { Tabs } from './Tabs'

const commonTabsTestIds = [
  'org-overview',
  'org-details',
  'org-individuals',
  'org-blended-licences',
]

describe(Tabs.name, () => {
  const commonTest = (tab: string, region: AwsRegions) => {
    vi.stubEnv('VITE_AWS_REGION', region)
    render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId(tab)).toBeInTheDocument()
  }

  it('should render the component', () => {
    render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId('org-overview')).toBeInTheDocument()
  })
  it('should not render any tab if organisation id is ALL', () => {
    render(
      <Routes>
        <Route
          path={`/organisations/:id`}
          element={<Tabs organization={null} />}
        />
      </Routes>,
      {},
      { initialEntries: ['/organisations/all'] },
    )
    expect(screen.queryByTestId('org-overview')).not.toBeInTheDocument()
  })
  it.each(commonTabsTestIds)('should render coomon tabs on anz %s', tab => {
    commonTest(tab, AwsRegions.Australia)
  })
  it.each(commonTabsTestIds)('should render coomon tabs on uk %s', tab => {
    commonTest(tab, AwsRegions.UK)
  })
  it('should not render the affiliated tab on UK', () => {
    render(<Tabs organization={buildOrganization()} />)
    expect(screen.queryByTestId('affiliated-orgs')).not.toBeInTheDocument()
  })
  it('should render the affiliated tab on AU', () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
    render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId('affiliated-orgs')).toBeInTheDocument()
  })
  it.each([RoleName.TT_ADMIN, RoleName.TT_OPS])(
    'should render the permissions tab for allowed roles -- %s role',
    role => {
      render(<Tabs organization={buildOrganization()} />, {
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
    'should not render the permissions tab for roles without permissions -- %s role',
    role => {
      render(<Tabs organization={buildOrganization()} />, {
        auth: {
          activeRole: role,
        },
      })
      expect(screen.queryByTestId('org-permissions')).not.toBeInTheDocument()
    },
  )
  it('should switch tabs on tab click', () => {
    render(<Tabs organization={buildOrganization()} />)
    expect(screen.getByTestId('org-overview')).toBeInTheDocument()
    screen.getByTestId('org-details').click()
    expect(screen.getByTestId('org-details')).toBeInTheDocument()
  })
})
