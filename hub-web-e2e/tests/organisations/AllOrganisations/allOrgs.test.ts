/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test } from '@playwright/test'

import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `View all organisations page as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
    },
  ]
  for (const data of dataSet) {
    test(`${data.name} ${data.smoke}`, async ({ browser }) => {
      const context = await browser.newContext({
        storageState: stateFilePath(data.user as StoredCredentialKey),
      })
      const page = await context.newPage()
      const allOrgsPage = new AllOrganisations(page)
      await allOrgsPage.goto()
      await allOrgsPage.checkAllOrganisationsPage('All organisations')
    })
  }
})
