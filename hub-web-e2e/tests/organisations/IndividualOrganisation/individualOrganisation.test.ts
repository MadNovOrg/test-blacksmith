/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test } from '@playwright/test'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `View individual organisation page as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      orgName: 'Australia Main Organisation',
      isAffiliated: false,
      mainOrgName: '',
    },
  ]

  if (!isUK()) {
    dataSet.push({
      name: `View affiliated organisation page as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      orgName: 'New Zealand First Affiliated Organisation',
      mainOrgName: 'New Zealand Main Organisation',
      isAffiliated: true,
    })
  }

  for (const data of dataSet) {
    test(`${data.name} ${data.smoke}`, async ({ browser }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()

      const individualOrgPage = new IndividualOrganisationPage(page)
      const orgId = await API.organization.getOrganizationId(data.orgName)
      await individualOrgPage.goto(orgId)
      await individualOrgPage.checkOrgPage(
        data.orgName,
        data.isAffiliated,
        ['admin', 'ops'].includes(data.user),
      )

      if (data.isAffiliated && data.mainOrgName) {
        const mainOrgPage = await individualOrgPage.goToMainOrg()
        await mainOrgPage.checkOrgPage(
          data.mainOrgName,
          false,
          ['admin', 'ops'].includes(data.user),
        )
      }
    })
  }
})
