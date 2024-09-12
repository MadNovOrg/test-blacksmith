import { GetMainOrganisationDetailsQuery } from '@app/generated/graphql'
import useOrgV2 from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import { RoleName } from '@app/types'

import { chance, render, screen } from '@test/index'
import {
  buildANZAffiliatedOrganisation,
  buildANZMainOrganisation,
} from '@test/mock-data-utils'

import { OrgDetailsTab } from './OrgDetailsTab'

vi.mock('@app/modules/organisation/hooks/ANZ/useOrgV2')

const useOrganisationMock = vi.mocked(useOrgV2)

describe('component: OrgDetailsTab', () => {
  const mainOrgId = chance.guid()
  const mainOrgName = chance.name()
  const affiliatedOrgId = chance.guid()

  const mainOrg = buildANZMainOrganisation({
    overrides: {
      id: mainOrgId,
      name: mainOrgName,
      affiliated_organisations: [
        buildANZAffiliatedOrganisation({
          overrides: {
            id: affiliatedOrgId,
            main_organisation_id: mainOrgId,
          },
        }),
      ],
    },
  })

  const setup = (role: RoleName) => {
    useOrganisationMock.mockReturnValue({
      fetching: false,
      data: {
        orgs: [mainOrg] as unknown as GetMainOrganisationDetailsQuery['orgs'],
        orgsCount: { aggregate: { count: 1 } },
        specificOrg: [mainOrg],
      },
      reexecute: vi.fn(),
      error: undefined,
    })

    render(<OrgDetailsTab orgId={mainOrgId} />, {
      auth: {
        activeRole: role,
        isOrgAdmin: role === RoleName.USER,
        managedOrgIds: [role === RoleName.USER ? mainOrgId : ''],
      },
    })
  }
  ;[
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
    RoleName.FINANCE,
    RoleName.LD,
    RoleName.USER,
  ].forEach(role => {
    it(`displays main org details if a user is ${
      role === RoleName.USER ? 'orgAdmin' : role
    }`, () => {
      setup(role)
      expect(screen.getByText(mainOrgName)).toBeInTheDocument()
      expect(screen.getByText(mainOrg.sector)).toBeInTheDocument()
      expect(screen.getByText(mainOrg.address.line1)).toBeInTheDocument()
      expect(screen.getByText(mainOrg.address.city)).toBeInTheDocument()
      expect(screen.getByText(mainOrg.address.postCode)).toBeInTheDocument()
      expect(
        screen.queryByText(mainOrg.address.region ?? ''),
      ).toBeInTheDocument()
      expect(screen.getByText(mainOrg.address.country)).toBeInTheDocument()
    })

    it(
      `displays affiliated org details if a user is ${
        role === RoleName.USER ? 'orgAdmin' : role
      }`,
    ),
      () => {
        setup(role)
        expect(screen.getByText(mainOrgName)).toBeInTheDocument()
        expect(screen.getByText(mainOrg.sector)).toBeInTheDocument()
        expect(screen.getByText(mainOrg.address.line1)).toBeInTheDocument()
        expect(screen.getByText(mainOrg.address.city)).toBeInTheDocument()
        expect(screen.getByText(mainOrg.address.postCode)).toBeInTheDocument()
        expect(
          screen.queryByText(mainOrg.address.region ?? ''),
        ).toBeInTheDocument()
        expect(screen.getByText(mainOrg.address.country)).toBeInTheDocument()
      }
  })
})
