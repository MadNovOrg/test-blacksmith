import { GetMainOrganisationDetailsQuery } from '@app/generated/graphql'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'
import { RoleName } from '@app/types'

import { render, screen } from '@test/index'
import { buildOrganization } from '@test/mock-data-utils'

import Organizations from './Organisations'

vi.mock('@app/modules/organisation/hooks/UK/useOrgV2')
const useOrgV2Mock = vi.mocked(useOrgV2)

describe(Organizations.name, () => {
  const orgs = [buildOrganization()]
  useOrgV2Mock.mockReturnValue({
    fetching: false,
    reexecute: vi.fn(),
    error: undefined,
    data: {
      orgs: orgs as unknown as GetMainOrganisationDetailsQuery['orgs'],
      orgsCount: {
        aggregate: {
          count: 2,
        },
      },
      specificOrg: [],
    },
  })

  it('it displays checkbox next to each organisation while merging', () => {
    render(
      <Organizations />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      {
        initialEntries: ['/organisations/merge'],
      },
    )
    const orgsTable = screen.getByTestId('orgs-table')
    expect(orgsTable).toBeInTheDocument()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(orgs.length)
  })
})
