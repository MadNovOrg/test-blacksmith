/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { ORGANIZATION_INSERT } from '@qa/data/organization'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { sectors, stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      user: `${allowedUser}`,
      name: 'main org',
      isAffiliate: false,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      orgName: 'Main org to update',
      isAffiliatedOrg: false,
    },
    {
      user: `${allowedUser}`,
      name: 'affiliated org',
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      orgName: 'Affiliate org to update',
      isAffiliatedOrg: true,
      mainOrgName: 'Australia Main Organisation',
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ organisation: { id: string; name: string } }>({
      organisation: async ({}, use) => {
        let main_org_id = null
        if (data.isAffiliatedOrg && data.mainOrgName) {
          main_org_id = await API.organization.getOrganizationId(
            data.mainOrgName,
          )
        }
        const orgId = await API.organization.insertOrganization(
          ORGANIZATION_INSERT(data.orgName, '', '', main_org_id),
        )
        await use({
          id: orgId,
          name: data.orgName,
        })

        await API.organization.deleteOrganization(orgId)
      },
    })
    if (isUK()) {
      // Skip the test for UK
      test.skip()
    } else {
      test(`Edit ${data.name} as ${data.user} ${data.smoke}`, async ({
        browser,
        organisation,
      }) => {
        const newOrgName = 'Updated ' + organisation.name
        const newOrgSector = 'anz_edu'
        const newOrgType = 'State Education'
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const orgPage = new IndividualOrganisationPage(page)
        await orgPage.goto(organisation.id)
        const editOrgPage = await orgPage.clickEditOrgButton()
        await editOrgPage.goto(organisation.id)
        await editOrgPage.waitForPageLoad()
        await editOrgPage.setOrgName(newOrgName)
        await editOrgPage.setSector(newOrgSector)
        await editOrgPage.setOrgType(newOrgType)
        const editedOrgPage = await editOrgPage.clickSaveOrganisationButton()
        await editedOrgPage.checkOrgDetailsValues(
          newOrgName,
          sectors.anz_edu,
          newOrgType,
        )
      })
    }
  }
})
