import { useTranslation } from 'react-i18next'

import { GetMainOrganisationDetailsQuery } from '@app/generated/graphql'
import useOrgV2 from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import { Organizations } from '@app/modules/organisation/pages/Organisations/ANZ/Organisations'
import { RoleName } from '@app/types'

import { chance, _render, screen, renderHook, userEvent } from '@test/index'
import {
  buildANZAffiliatedOrganisation,
  buildANZMainOrganisation,
} from '@test/mock-data-utils'
vi.mock('@app/modules/organisation/hooks/ANZ/useOrgV2')
const useOrgV2Mock = vi.mocked(useOrgV2)
describe('page: Organisations', () => {
  const roles = [
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
    RoleName.USER,
  ]
  const isOrgAdmin = (role: RoleName) => role === RoleName.USER
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const firstMainOrgId = chance.guid()
  const secondMainOrgId = chance.guid()
  const firstMainOrgAffiliatedOrgId = chance.guid()
  const secondMainOrgAffiliatedOrgId = chance.guid()

  const affiliatedOrgs = [
    buildANZAffiliatedOrganisation({
      overrides: {
        id: firstMainOrgAffiliatedOrgId,
        main_organisation_id: firstMainOrgId,
      },
    }),
    buildANZAffiliatedOrganisation({
      overrides: {
        id: secondMainOrgAffiliatedOrgId,
        main_organisation_id: secondMainOrgId,
      },
    }),
  ]

  const mainOrgs = [
    buildANZMainOrganisation({
      overrides: {
        id: firstMainOrgId,
        affiliated_organisations: affiliatedOrgs,
        affiliated_organisations_aggregate: {
          aggregate: {
            count: affiliatedOrgs.length,
          },
        },
      },
    }),
    buildANZMainOrganisation({
      overrides: {
        id: secondMainOrgId,
      },
    }),
  ]

  const setup = (role: RoleName) => {
    useOrgV2Mock.mockReturnValue({
      fetching: false,
      reexecute: vi.fn(),
      error: undefined,
      data: {
        orgs: mainOrgs as unknown as GetMainOrganisationDetailsQuery['orgs'],
        orgsCount: {
          aggregate: {
            count: 2,
          },
        },
        specificOrg: [],
      },
    })

    _render(<Organizations />, {
      auth: {
        activeRole: role,
        isOrgAdmin: isOrgAdmin(role),
        managedOrgIds: isOrgAdmin(role)
          ? [firstMainOrgId, secondMainOrgId]
          : [],
      },
    })
  }
  roles.forEach(role => {
    it(`renders the Organisations page with all components if role is ${
      isOrgAdmin(role) ? 'org-admin' : role
    }`, async () => {
      setup(role)
      const orgsTable = screen.getByTestId('orgs-table')

      // Check if the table is rendered
      expect(orgsTable).toBeInTheDocument()

      //Check if filters are rendered
      const searchFilter = screen.getByTestId('FilterSearch-Input')
      expect(searchFilter).toBeInTheDocument()
      const sectorFilter = screen.getByTestId('FilterByOrgSector')
      expect(sectorFilter).toBeInTheDocument()
      const countryFilter = screen.getByTestId('FilterByCountry')
      expect(countryFilter).toBeInTheDocument()

      // Check if the add new org button is rendered (only for non-org-admin roles)
      if (!isOrgAdmin(role)) {
        const addOrgButton = screen.getByTestId('add-new-org-button')
        expect(addOrgButton).toBeInTheDocument()
      }
    })

    it(`renders the main organisations details if role is ${
      isOrgAdmin(role) ? 'org-admin' : role
    }`, async () => {
      setup(role)
      mainOrgs.forEach(org => {
        const row = screen.getByTestId(`org-row-${org.id}`)
        expect(row).toBeInTheDocument()
        const expectedValues = [
          org.name,
          org.address.country,
          org.address.region ?? '',
          t(`common.org-sectors.${org.sector}`),
          t('dates.withTime', {
            date: org.createdAt,
          }),
        ]
        expect(
          expectedValues.every(value => row.textContent?.includes(value)),
        ).toBe(true)
      })
    })

    it(`renders the affiliated organisations details if role is ${
      isOrgAdmin(role) ? 'org-admin' : role
    }`, async () => {
      setup(role)
      const firstRowDropdownButton = screen.getByTestId(
        `org-row-toggle-${firstMainOrgId}`,
      )
      expect(firstRowDropdownButton).toBeInTheDocument()
      await userEvent.click(firstRowDropdownButton)

      // Check if the affiliated orgs table is rendered
      expect(
        screen.getByTestId(`affiliated-orgs-table-${firstMainOrgId}`),
      ).toBeInTheDocument()

      // Check if the affiliated orgs are rendered correctly
      mainOrgs[0].affiliated_organisations?.forEach(affiliatedOrg => {
        const row = screen.getByTestId(`affiliated-org-row-${affiliatedOrg.id}`)
        expect(row).toBeInTheDocument()
        const expectedValues = [
          affiliatedOrg.name,
          affiliatedOrg.address.country,
          affiliatedOrg.address.region ?? '',
          t(`common.org-sectors.${affiliatedOrg.sector}`),
          t('dates.withTime', {
            date: affiliatedOrg.createdAt,
          }),
        ]
        expect(
          expectedValues.every(value => row.textContent?.includes(value)),
        ).toBe(true)
      })
    })
  })
  it('it displays checkbox next to each organisation while merging', () => {
    _render(
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
    expect(checkboxes.length).toBe(mainOrgs.length)
  })
  it('displays checkboxes for affiliated organisations while merging', async () => {
    _render(
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
    const firstRowDropdownButton = screen.getByTestId(
      `org-row-toggle-${firstMainOrgId}`,
    )
    await userEvent.click(firstRowDropdownButton)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(affiliatedOrgs.length + mainOrgs.length)
  })
})
