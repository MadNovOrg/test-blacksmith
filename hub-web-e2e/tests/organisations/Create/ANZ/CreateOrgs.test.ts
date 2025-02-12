/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import { Organization } from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { CreateOrganisationPage } from '@qa/fixtures/pages/org/CreateOrganisation.fixture'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { OrganisationListPage } from '@qa/fixtures/pages/org/OrganisationsList.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  if (isUK()) {
    // Skip test on UK
    base.skip()
  } else {
    base(
      `View ANZ create organisation page as ${allowedUser} ${
        allowedUser === 'admin' ? '@smoke' : ''
      }`,
      async ({ browser }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(allowedUser as StoredCredentialKey),
        })
        const page = await context.newPage()
        const orgListPage = new OrganisationListPage(page)
        await orgListPage.goto()
        const createOrgPage = await orgListPage.clickAddNewOrgButton()

        // Check if the create organisation page is displayed
        await createOrgPage.checkCommonFields()

        await createOrgPage.checkSpecificANZFields()
      },
    )
  }

  const dataSet = [
    {
      user: `${allowedUser}`,
      name: 'main org on AU',
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      organisation: (() => {
        const organisation = UNIQUE_ORGANIZATION()
        organisation.name = 'Australia Second Main Organisation'
        organisation.address = {
          line1: 'Random AU Address Line 1',
          line2: 'Random AU Address Line 2',
          city: 'Random AU City',
          postCode: 'Random AU Post Code',
          country: 'Australia',
          countryCode: 'AU',
          region: 'Australian Capital Territory',
        }
        organisation.sector = 'anz_health'
        organisation.organisationType = 'Private hospital'
        organisation.attributes = {
          email: 'aus2MainOrg@teamteach.testinator.com',
          phone: '+61 486 515 955',
          website: '',
          headSurname: '',
          settingName: '',
          headFirstName: '',
          headEmailAddress: '',
        }
        return organisation
      })(),
      isAffiliatedOrg: false,
    },
    {
      user: `${allowedUser}`,
      name: 'affiliated org on NZ',
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      organisation: (() => {
        const organisation = UNIQUE_ORGANIZATION()
        organisation.name = 'New Zealand Second Affiliated Organisation'
        organisation.address = {
          line1: 'Random NZ Address Line 1',
          line2: 'Random NZ Address Line 2',
          city: 'Random NZ City',
          postCode: 'Random NZ Post Code',
          country: 'New Zealand',
          countryCode: 'NZ',
          region: 'Northland',
        }
        organisation.sector = 'anz_edu'
        organisation.organisationType = 'State Education'
        organisation.attributes = {
          email: 'nz2AffiliatedOrg@teamteach.testinator.com',
          phone: '+64 4 519 8865',
          website: 'Random Website',
          headSurname: 'John',
          settingName: 'Random Setting',
          headFirstName: 'Doe',
          headEmailAddress: 'johndoe@teamteach.testinator.com',
        }
        return organisation
      })(),
      isAffiliatedOrg: true,
      mainOrgName: 'New Zealand Main Organisation',
    },
    {
      user: `${allowedUser}`,
      name: 'main org on Fiji',
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      organisation: (() => {
        const organisation = UNIQUE_ORGANIZATION()
        organisation.name = 'First Fiji Main Organisation'
        organisation.address = {
          line1: 'Random FJ Address Line 1',
          line2: 'Random FJ Address Line 2',
          city: 'Random FJ City',
          postCode: 'Random FJ Post Code',
          country: 'Fiji',
          countryCode: 'FJ',
        }
        organisation.sector = 'anz_ss'
        organisation.organisationType = 'Aged Care'
        organisation.attributes = {
          email: 'fiji1MainOrg@teamteach.testinator.com',
          phone: '+679 459 2158',
          website: 'Random Website',
          headSurname: 'Jane',
          settingName: 'Random Setting',
          headFirstName: 'Doe',
          headEmailAddress: 'janedoe@teamteach.testinator.com',
        }
        return organisation
      })(),
      isAffiliatedOrg: false,
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ organisation: Organization }>({
      organisation: async ({}, use) => {
        await use({
          ...data.organisation,
        })

        await API.organization.deleteOrganization(data.organisation.id)
      },
    })

    if (isUK()) {
      // Skip test on UK
      test.skip()
    } else {
      test(`Create ${data.name} as ${data.user} ${data.smoke}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const createOrgPage = new CreateOrganisationPage(page)
        await createOrgPage.goto()
        await createOrgPage.fillOrgDetails(
          data.organisation,
          data.isAffiliatedOrg,
          data.mainOrgName,
        )
        data.organisation.id = await createOrgPage.getOrgIdOnCreation()
        const organisationPage = new IndividualOrganisationPage(page)
        organisationPage.goto(data.organisation.id)
        await organisationPage.checkOrgPage(
          data.organisation.name,
          data.isAffiliatedOrg,
          ['admin', 'ops'].includes(data.user),
        )
      })
    }
  }
})
