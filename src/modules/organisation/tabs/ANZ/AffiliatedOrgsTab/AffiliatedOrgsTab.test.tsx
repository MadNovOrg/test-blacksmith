import { useTranslation } from 'react-i18next'

import {
  GetAffiliatedOrganisationsQuery,
  GetMainOrganisationDetailsQuery,
} from '@app/generated/graphql'
import useAffiliatedOrganisations from '@app/modules/organisation/hooks/ANZ/useAffiliatedOrganisations'
import useOrgV2 from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import { RoleName, Organization } from '@app/types'

import {
  chance,
  _render,
  screen,
  within,
  renderHook,
  userEvent,
} from '@test/index'
import {
  buildANZAffiliatedOrganisation,
  buildANZMainOrganisation,
} from '@test/mock-data-utils'

import { AffiliatedOrgsTab } from './AffiliatedOrgsTab'

vi.mock('@app/modules/organisation/hooks/ANZ/useOrgV2')
vi.mock('@app/modules/organisation/hooks/ANZ/useAffiliatedOrganisations')

const useOrgV2Mock = vi.mocked(useOrgV2)
const useAffiliatedOrganisationsMock = vi.mocked(useAffiliatedOrganisations)
describe('component: AffiliatedOrgsTab', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const mainOrgId = chance.guid()
  const mainOrgName = chance.name()
  const firstAffiliatedOrgId = chance.guid()
  const secondAffiliatedOrgId = chance.guid()

  const mainOrg = buildANZMainOrganisation({
    overrides: {
      id: mainOrgId,
      name: mainOrgName,
    },
  })

  const affiliatedOrganisations = [
    buildANZAffiliatedOrganisation({
      overrides: {
        id: firstAffiliatedOrgId,
        name: 'First affiliated Org',
        main_organisation_id: mainOrgId,
      },
    }),

    buildANZAffiliatedOrganisation({
      overrides: {
        id: secondAffiliatedOrgId,
        name: 'Second affiliated Org',
        main_organisation_id: mainOrgId,
      },
    }),
  ]
  const setup = (affiliatedOrganisations: Organization[], role: RoleName) => {
    useOrgV2Mock.mockReturnValue({
      fetching: false,
      data: {
        orgs: [mainOrg] as unknown as GetMainOrganisationDetailsQuery['orgs'],
        orgsCount: { aggregate: { count: 2 } },
        specificOrg: [mainOrg],
      },
      reexecute: vi.fn(),
      error: undefined,
    })

    useAffiliatedOrganisationsMock.mockReturnValue({
      data: {
        organizations:
          affiliatedOrganisations as unknown as GetAffiliatedOrganisationsQuery['organizations'],
      },
      reexecute: vi.fn(),
      error: undefined,
      loading: false,
    })

    _render(<AffiliatedOrgsTab orgId={mainOrgId} />, {
      auth: {
        activeRole: role,
        isOrgAdmin: role === RoleName.USER,
        managedOrgIds: role === RoleName.USER ? [mainOrgId] : [],
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
    it(`displays affiliated orgs column details if a user is ${
      role === RoleName.USER ? 'org-admin' : role
    }`, () => {
      setup(affiliatedOrganisations, role)

      affiliatedOrganisations.forEach(affiliatedOrg => {
        const row = screen.getByTestId(`affiliated-org-${affiliatedOrg.id}`)
        const expectedValues = [
          affiliatedOrg.name,
          affiliatedOrg.address.country,
          affiliatedOrg.address.region ?? '',
          t(`common.org-sectors.${affiliatedOrg.sector}`),
          t('dates.withTime', {
            date: affiliatedOrg.createdAt,
          }),
        ]
        expect(row).toBeInTheDocument()
        expect(
          expectedValues.every(value => row.textContent?.includes(value)),
        ).toBe(true)
      })
    })

    it(`displays no affiliated orgs message if a user is ${
      role === RoleName.USER ? 'org-admin' : role
    }`, () => {
      setup([], role)
      const affiliatedOrgsTable = screen.getByTestId('affiliated-organisations')

      expect(
        within(affiliatedOrgsTable).getByText(
          'No affiliated organisations at this time',
        ),
      ).toBeInTheDocument()
    })
  })
  ;[
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ].forEach(role => {
    it(`displays the Add an affiliate button, and renders modal if a user is ${role}`, async () => {
      setup(affiliatedOrganisations, role)
      const addAnAffiliateButton = screen.getByTestId('add-an-affiliate')
      expect(addAnAffiliateButton).toBeInTheDocument()
      await userEvent.click(addAnAffiliateButton)
      const addAnAffiliateModal = screen.getByTestId('add-affiliated-org-modal')
      expect(addAnAffiliateModal).toBeInTheDocument()
      expect(
        screen.getByText(
          t('pages.org-details.tabs.affiliated-orgs.add-affiliate.title'),
        ),
      ).toBeInTheDocument()
      expect(screen.getByText(mainOrgName)).toBeInTheDocument()
    })

    it(`displays unlink organisations modal when user clicks Manage organisation button if user is ${role}`, async () => {
      setup(affiliatedOrganisations, role)
      const firstRow = screen.getByTestId(
        `affiliated-org-${affiliatedOrganisations[0].id}`,
      )
      const manageOrganisationBytton = within(firstRow).getByTestId(
        'manage-affiliated-orgs',
      )
      await userEvent.click(manageOrganisationBytton)
      const unlinkOrganisationButton = screen.getByRole('menuitem', {
        name: /unlink organisation/i,
      })

      expect(unlinkOrganisationButton).toBeInTheDocument()

      await userEvent.click(unlinkOrganisationButton)

      expect(
        screen.getByTestId('remove-affiliated-org-modal'),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          t(
            'pages.org-details.tabs.affiliated-orgs.remove-affiliate.description',
          ),
        ),
      ).toBeInTheDocument()
    })

    it(`displays unlink organisations modal when user clicks Manage selected button if user is ${role}`, async () => {
      setup(affiliatedOrganisations, role)

      const firstRow = screen.getByTestId(
        `affiliated-org-${affiliatedOrganisations[0].id}`,
      )
      const manageSelectedAffiliatedOrgsButton = screen.getByRole('button', {
        name: /manage selected/i,
      })
      expect(manageSelectedAffiliatedOrgsButton).toBeInTheDocument()
      expect(manageSelectedAffiliatedOrgsButton).toBeDisabled()
      const checkbox = within(firstRow).getByRole('checkbox')
      await userEvent.click(checkbox)
      expect(checkbox).toBeChecked()
      expect(manageSelectedAffiliatedOrgsButton).not.toBeDisabled()
      await userEvent.click(manageSelectedAffiliatedOrgsButton)

      const unlinkOrganisationsButton = screen.getByRole('menuitem', {
        name: /unlink organisations/i,
      })

      expect(unlinkOrganisationsButton).toBeInTheDocument()

      await userEvent.click(unlinkOrganisationsButton)

      expect(
        screen.getByTestId('remove-affiliated-org-modal'),
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          t(
            'pages.org-details.tabs.affiliated-orgs.remove-affiliate.description',
          ),
        ),
      ).toBeInTheDocument()
    })
  })
})
