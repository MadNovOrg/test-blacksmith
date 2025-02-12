/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { ORGANIZATION_INSERT } from '@qa/data/organization'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      user: `${allowedUser}`,
      name: 'main org',
      isAffiliate: false,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      orgName: 'Main org to delete',
      isAffiliatedOrg: false,
    },
    {
      user: `${allowedUser}`,
      name: 'affiliated org',
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      orgName: 'Affiliate org to delete',
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
      },
    })
    if (isUK()) {
      // Skip the test for UK
      test.skip()
    } else {
      test(`Delete ${data.name} as ${data.user} ${data.smoke}`, async ({
        browser,
        organisation,
      }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const orgPage = new IndividualOrganisationPage(page)
        await orgPage.goto(organisation.id)
        await orgPage.checkOrgDetailsTab(data.isAffiliatedOrg)
        await orgPage.deleteOrg(data.orgName)
      })
    }
  }
})
