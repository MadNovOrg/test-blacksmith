import { GetOrganisationDetailsQuery } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { render, screen, waitFor } from '@test/index'

import { MergeOrganisations } from './MergeOrganisations'

const allowedRoles = [RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.LD]
const forbiddenRoles = Object.values(RoleName).filter(
  roleName => !allowedRoles.includes(roleName),
)

describe(MergeOrganisations.name, () => {
  it.each(allowedRoles)('should render for allowed %s role', activeRole => {
    render(<MergeOrganisations selectedOrgs={[]} />, {
      auth: {
        activeRole,
      },
    })
    expect(screen.getByTestId('merge-organizations-button')).toBeInTheDocument()
  })
  it.each(forbiddenRoles)(
    'should not render for forbidden %s role',
    activeRole => {
      render(<MergeOrganisations selectedOrgs={[]} />, {
        auth: {
          activeRole,
        },
      })
      expect(
        screen.queryByTestId('merge-organizations-button'),
      ).not.toBeInTheDocument()
    },
  )
  it('should render the merge selected as disabled button when merging', () => {
    render(
      <MergeOrganisations selectedOrgs={[]} />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: ['/merge'] },
    )
    expect(screen.getByTestId('merge-selected-button')).toBeInTheDocument()
    expect(screen.getByTestId('merge-selected-button')).toBeDisabled()
  })
  it('should open the merge organisations dialog when clicking the merge selected button', () => {
    const selectedOrgs = [
      {
        id: '1',
      },
      {
        id: '2',
      },
    ] as GetOrganisationDetailsQuery['orgs'][0][]

    render(
      <MergeOrganisations selectedOrgs={selectedOrgs} />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: ['/merge'] },
    )
    expect(screen.getByTestId('merge-selected-button')).toBeInTheDocument()
    expect(screen.getByTestId('merge-selected-button')).not.toBeDisabled()
    screen.getByTestId('merge-selected-button').click()
    waitFor(() => {
      expect(screen.getByTestId('merge-organisations-dialog')).toBeVisible()
    })
  })
})
