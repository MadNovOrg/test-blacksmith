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
  const dataSet = [
    {
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      organisation: (() => {
        const organisation = UNIQUE_ORGANIZATION(
          'England Second Main Organisation',
          'England',
          'GB-ENG',
        )
        return organisation
      })(),
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ organisation: Organization }>({
      organisation: async ({}, use) => {
        await use({
          ...data.organisation,
        })
      },
    })

    if (!isUK()) {
      // Skip test on ANZ
      test.skip()
    } else {
      test(`View UK create organisation page as ${data.user} ${data.smoke}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const orgListPage = new OrganisationListPage(page)
        await orgListPage.goto()
        const createOrgPage = await orgListPage.clickAddNewOrgButton()

        // Check if the create organisation page is displayed
        await createOrgPage.checkCommonFields()

        await createOrgPage.checkSpecificUKFields()
      })

      test(`Create org as ${data.user} ${data.smoke}`, async ({ browser }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const createOrgPage = new CreateOrganisationPage(page)
        await createOrgPage.goto()
        await createOrgPage.fillOrgDetails(data.organisation, false)
        data.organisation.id = await createOrgPage.getOrgIdOnCreation()
        const organisationPage = new IndividualOrganisationPage(page)
        organisationPage.goto(data.organisation.id)
        await organisationPage.checkOrgPage(
          data.organisation.name,
          false,
          ['admin', 'ops'].includes(data.user),
        )

        await API.organization.deleteOrganization(data.organisation.id)
      })
    }
  }
})
