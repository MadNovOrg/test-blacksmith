import { format } from 'date-fns'
import { useFeatureFlagEnabled } from 'posthog-js/react'

import {
  GetMainOrganisationDetailsQuery,
  GetOrganisationDetailsQuery,
} from '@app/generated/graphql'
import ANZhook from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import UKhook from '@app/modules/organisation/hooks/UK/useOrgV2'
import { AwsRegions, RoleName } from '@app/types'

import { chance, render } from '@test/index'
import {
  buildANZAffiliatedOrganisation,
  buildANZMainOrganisation,
  buildOrganization,
} from '@test/mock-data-utils'

import { OrgDetailsTab } from '.'

vi.mock('@app/modules/organisation/hooks/ANZ/useOrgV2')
vi.mock('@app/modules/organisation/hooks/UK/useOrgV2')

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

const useOrganisationMockANZ = vi.mocked(ANZhook)
const useOrganisationMockUK = vi.mocked(UKhook)
const editOrgRoles = [
  RoleName.TT_ADMIN,
  RoleName.TT_OPS,
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
  RoleName.USER,
]

const deleteOrgRoles = [
  RoleName.TT_ADMIN,
  RoleName.TT_OPS,
  RoleName.SALES_ADMIN,
]

describe('component: OrgDetailsTab ANZ', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })
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
    useOrganisationMockANZ.mockReturnValue({
      fetching: false,
      data: {
        orgs: [mainOrg] as unknown as GetMainOrganisationDetailsQuery['orgs'],
        orgsCount: { aggregate: { count: 1 } },
        specificOrg: [mainOrg],
      },
      reexecute: vi.fn(),
      error: undefined,
    })

    const { getByTestId } = render(<OrgDetailsTab orgId={mainOrgId} />, {
      auth: {
        activeRole: role,
        isOrgAdmin: role === RoleName.USER,
        managedOrgIds: [role === RoleName.USER ? mainOrgId : ''],
      },
    })
    return getByTestId
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
      const getByTestId = setup(role)
      const orgNameRow = getByTestId('org-name-row')
      const orgSectorRow = getByTestId('org-sector-row')
      const orgTypeRow = getByTestId('org-type-row')
      const orgPhoneRow = getByTestId('org-phone-row')
      const orgEmailRow = getByTestId('org-email-row')
      const addrLine1Row = getByTestId('org-address-line-1-row')
      const addrLine2Row = getByTestId('org-address-line-2-row')
      const cityRow = getByTestId('org-city-row')
      const postCodeRow = getByTestId('org-postcode-row')
      const regionRow = getByTestId('org-region-row')
      const countryRow = getByTestId('org-country-row')
      const headFirstNameRow = getByTestId('head-first-name-row')
      const headSurnameRow = getByTestId('head-surname-row')
      const headEmailRow = getByTestId('head-email-row')
      const settingNameRow = getByTestId('setting-name-row')
      orgNameRow.click()
      orgSectorRow.click()
      orgTypeRow.click()
      orgPhoneRow.click()
      orgEmailRow.click()
      addrLine1Row.click()
      addrLine2Row.click()
      cityRow.click()
      postCodeRow.click()
      regionRow.click()
      countryRow.click()
      headFirstNameRow.click()
      headSurnameRow.click()
      headEmailRow.click()
      settingNameRow.click()

      expect(orgNameRow).toHaveTextContent(mainOrgName)
      expect(orgSectorRow).toHaveTextContent('Education') // sector is by default anz_edu
      expect(orgTypeRow).toHaveTextContent(mainOrg.organisationType)
      expect(orgPhoneRow).toHaveTextContent(mainOrg.attributes.phone)
      expect(orgEmailRow).toHaveTextContent(mainOrg.attributes.email)
      expect(addrLine1Row).toHaveTextContent(mainOrg.address.line1)
      expect(addrLine2Row).toHaveTextContent(mainOrg.address.line2)
      expect(cityRow).toHaveTextContent(mainOrg.address.city)
      expect(postCodeRow).toHaveTextContent(mainOrg.address.postCode)
      expect(regionRow).toHaveTextContent(mainOrg.address.region ?? '')
      expect(countryRow).toHaveTextContent(mainOrg.address.country)
      expect(headFirstNameRow).toHaveTextContent(
        mainOrg.attributes.headFirstName,
      )
      expect(headSurnameRow).toHaveTextContent(mainOrg.attributes.headSurname)
      expect(headEmailRow).toHaveTextContent(
        mainOrg.attributes.headEmailAddress,
      )
      expect(settingNameRow).toHaveTextContent(mainOrg.attributes.settingName)
    })

    it(`displays affiliated org details if a user is ${
      role === RoleName.USER ? 'orgAdmin' : role
    }`, () => {
      const getByTestId = setup(role)

      const orgNameRow = getByTestId('org-name-row')
      const orgSectorRow = getByTestId('org-sector-row')
      const orgTypeRow = getByTestId('org-type-row')
      const orgPhoneRow = getByTestId('org-phone-row')
      const orgEmailRow = getByTestId('org-email-row')
      const addrLine1Row = getByTestId('org-address-line-1-row')
      const addrLine2Row = getByTestId('org-address-line-2-row')
      const cityRow = getByTestId('org-city-row')
      const postCodeRow = getByTestId('org-postcode-row')
      const regionRow = getByTestId('org-region-row')
      const countryRow = getByTestId('org-country-row')
      const headFirstNameRow = getByTestId('head-first-name-row')
      const headSurnameRow = getByTestId('head-surname-row')
      const headEmailRow = getByTestId('head-email-row')
      const settingNameRow = getByTestId('setting-name-row')
      orgNameRow.click()
      orgSectorRow.click()
      orgTypeRow.click()
      orgPhoneRow.click()
      orgEmailRow.click()
      addrLine1Row.click()
      addrLine2Row.click()
      cityRow.click()
      postCodeRow.click()
      regionRow.click()
      countryRow.click()
      headFirstNameRow.click()
      headSurnameRow.click()
      headEmailRow.click()
      settingNameRow.click()

      expect(orgNameRow).toHaveTextContent(mainOrgName)
      expect(orgSectorRow).toHaveTextContent('Education') // sector is by default anz_edu

      expect(orgTypeRow).toHaveTextContent(mainOrg.organisationType)
      expect(orgPhoneRow).toHaveTextContent(mainOrg.attributes.phone)
      expect(orgEmailRow).toHaveTextContent(mainOrg.attributes.email)
      expect(addrLine1Row).toHaveTextContent(mainOrg.address.line1)
      expect(addrLine2Row).toHaveTextContent(mainOrg.address.line2)
      expect(cityRow).toHaveTextContent(mainOrg.address.city)
      expect(postCodeRow).toHaveTextContent(mainOrg.address.postCode)
      expect(regionRow).toHaveTextContent(mainOrg.address.region ?? '')
      expect(countryRow).toHaveTextContent(mainOrg.address.country)
      expect(headFirstNameRow).toHaveTextContent(
        mainOrg.attributes.headFirstName,
      )
      expect(headSurnameRow).toHaveTextContent(mainOrg.attributes.headSurname)
      expect(headEmailRow).toHaveTextContent(
        mainOrg.attributes.headEmailAddress,
      )
      expect(settingNameRow).toHaveTextContent(mainOrg.attributes.settingName)
    })
  })

  editOrgRoles.forEach(role => {
    it(`displays edit org button if a user is ${role}`, () => {
      const getByTestId = setup(role)
      const editOrgButton = getByTestId('edit-org-button')
      expect(editOrgButton).toBeInTheDocument()
      editOrgButton.click()
    })
  })

  deleteOrgRoles.forEach(role => {
    it(`displays delete org button if a user is ${role}`, () => {
      const getByTestId = setup(role)
      const deleteOrgButton = getByTestId('delete-org-button')
      expect(deleteOrgButton).toBeInTheDocument()
      deleteOrgButton.click()
    })
  })
})

describe('component: OrgDetailsTab UK', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  const orgId = chance.guid()
  const orgName = chance.name()
  const mainOrg = buildOrganization({
    overrides: {
      id: orgId,
      name: orgName,
      affiliated_organisations: [],
      tt_connect_id: chance.guid(),
    },
  })

  const setup = (role: RoleName) => {
    useOrganisationMockUK.mockReturnValue({
      fetching: false,
      data: {
        orgs: [mainOrg] as unknown as GetOrganisationDetailsQuery['orgs'],
        orgsCount: { aggregate: { count: 1 } },
        specificOrg: [mainOrg],
      },
      reexecute: vi.fn(),
      error: undefined,
    })

    const { getByTestId } = render(<OrgDetailsTab orgId={orgId} />, {
      auth: {
        activeRole: role,
        isOrgAdmin: role === RoleName.USER,
        managedOrgIds: [role === RoleName.USER ? orgId : ''],
        acl: {
          canViewTTConnectId: () => true,
        },
      },
    })
    return getByTestId
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
      const getByTestId = setup(role)
      const orgNameRow = getByTestId('org-name-row')
      const orgSectorRow = getByTestId('org-sector-row')
      const orgTypeRow = getByTestId('org-type-row')
      const orgPhoneRow = getByTestId('org-phone-row')
      const orgEmailRow = getByTestId('org-email-row')
      const addrLine1Row = getByTestId('org-address-line-1-row')
      const addrLine2Row = getByTestId('org-address-line-2-row')
      const cityRow = getByTestId('org-city-row')
      const postCodeRow = getByTestId('org-postcode-row')
      const countryRow = getByTestId('org-country-row')
      const headFirstNameRow = getByTestId('head-first-name-row')
      const headSurnameRow = getByTestId('head-surname-row')
      const headEmailRow = getByTestId('head-email-row')
      const settingNameRow = getByTestId('setting-name-row')
      const localAuthorityRow = getByTestId('local-authority-row')
      const ofstedRatingRow = getByTestId('ofsted-rating-row')
      const ofstedLastInspectionRow = getByTestId('ofsted-last-inspection-row')

      orgNameRow.click()
      orgSectorRow.click()
      orgTypeRow.click()
      orgPhoneRow.click()
      orgEmailRow.click()
      addrLine1Row.click()
      addrLine2Row.click()
      cityRow.click()
      postCodeRow.click()
      countryRow.click()
      headFirstNameRow.click()
      headSurnameRow.click()
      headEmailRow.click()
      settingNameRow.click()
      localAuthorityRow.click()
      ofstedRatingRow.click()
      ofstedLastInspectionRow.click()

      expect(orgNameRow).toHaveTextContent(orgName)
      expect(orgSectorRow).toHaveTextContent('Education')
      expect(orgTypeRow).toHaveTextContent(mainOrg.organisationType)
      expect(orgPhoneRow).toHaveTextContent(mainOrg.attributes.phone)
      expect(orgEmailRow).toHaveTextContent(mainOrg.attributes.email)
      expect(addrLine1Row).toHaveTextContent(mainOrg.address.line1)
      expect(addrLine2Row).toHaveTextContent(mainOrg.address.line2)
      expect(cityRow).toHaveTextContent(mainOrg.address.city)
      expect(postCodeRow).toHaveTextContent(mainOrg.address.postCode)
      expect(countryRow).toHaveTextContent(mainOrg.address.country)
      expect(headFirstNameRow).toHaveTextContent(
        mainOrg.attributes.headFirstName,
      )
      expect(headSurnameRow).toHaveTextContent(mainOrg.attributes.headSurname)
      expect(headEmailRow).toHaveTextContent(
        mainOrg.attributes.headEmailAddress,
      )
      expect(settingNameRow).toHaveTextContent(mainOrg.attributes.settingName)
      expect(localAuthorityRow).toHaveTextContent(
        mainOrg.attributes.localAuthority,
      )
      expect(ofstedRatingRow).toHaveTextContent(mainOrg.attributes.ofstedRating)
      expect(ofstedLastInspectionRow).toHaveTextContent(
        format(
          new Date(mainOrg.attributes.ofstedLastInspection),
          'd MMMM yyyy',
        ),
      )
    })
  })

  editOrgRoles.forEach(role => {
    it(`displays edit org button if a user is ${role}`, () => {
      const getByTestId = setup(role)
      const editOrgButton = getByTestId('edit-org-button')
      expect(editOrgButton).toBeInTheDocument()
      editOrgButton.click()
    })
  })

  deleteOrgRoles.forEach(role => {
    it(`displays delete org button if a user is ${role}`, () => {
      const getByTestId = setup(role)
      const deleteOrgButton = getByTestId('delete-org-button')
      expect(deleteOrgButton).toBeInTheDocument()
      deleteOrgButton.click()
    })
  })
  it.each([
    RoleName.SALES_REPRESENTATIVE,
    RoleName.SALES_ADMIN,
    RoleName.TT_OPS,
    RoleName.FINANCE,
    RoleName.TT_ADMIN,
    RoleName.LD,
  ])('can view Connect id as %s', role => {
    useFeatureFlagEnabledMock.mockReturnValue(true)
    const getByTestId = setup(role)
    expect(getByTestId('org-connect-id-section')).toBeInTheDocument()
    expect(getByTestId('org-connect-id-row')).toBeInTheDocument()
  })
})
