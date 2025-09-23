/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test } from '@playwright/test'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops'] as const

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      courseType: Course_Type_Enum.Closed,
      courseLevel: Course_Level_Enum.Level_1,
      reaccred: true,
      AUD_price: 40,
      NZD_price: 50,
    },
    {
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      courseType: Course_Type_Enum.Indirect,
      courseLevel: Course_Level_Enum.Level_1Np,
      reaccred: false,
      AUD_price: 60,
      NZD_price: 70,
    },
  ]

  test.describe('Resource Packs Pricing tab', () => {
    if (isUK()) {
      // Skip test on UK
      test.skip()
    } else {
      for (const data of dataSet) {
        test(`View Resource Packs Pricing tab as ${data.user} ${data.smoke}`, async ({
          browser,
        }) => {
          const context = await browser.newContext({
            storageState: stateFilePath(data.user as StoredCredentialKey),
          })
          const page = await context.newPage()

          const individualOrgPage = new IndividualOrganisationPage(page)
          const orgId = await API.organization.getOrganizationId(
            'Australia Main Organisation',
          )
          await individualOrgPage.goto(orgId)

          await individualOrgPage.checkResourcePacksPricingTab()
        })

        test(`Edits Org Resource Packs Pricing as ${data.user} ${data.smoke}`, async ({
          browser,
        }) => {
          const context = await browser.newContext({
            storageState: stateFilePath(data.user as StoredCredentialKey),
          })
          const page = await context.newPage()

          const individualOrgPage = new IndividualOrganisationPage(page)
          const orgId = await API.organization.getOrganizationId(
            'Australia Main Organisation',
          )
          await individualOrgPage.goto(orgId)
          await individualOrgPage.editOrgResourcePacksPricing(
            orgId,
            data.courseType,
            data.courseLevel,
            data.reaccred,
            data.AUD_price,
            data.NZD_price,
          )
        })
      }
    }
  })
})
