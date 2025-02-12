/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test } from '@playwright/test'

import * as API from '@qa/api'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops'] as const

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      orgName: 'Australia Main Organisation',
    },
  ]

  for (const data of dataSet) {
    test(`View Permissions tab as ${data.user} ${data.smoke}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()

      const individualOrgPage = new IndividualOrganisationPage(page)
      const orgId = await API.organization.getOrganizationId(data.orgName)
      await individualOrgPage.goto(orgId)

      await individualOrgPage.checkPermissionsTab()
    })
  }
})
