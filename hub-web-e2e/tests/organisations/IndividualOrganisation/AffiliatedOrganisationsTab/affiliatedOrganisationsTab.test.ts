/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import { Organization_Insert_Input } from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { ORGANIZATION_INSERT } from '@qa/data/organization'
import { IndividualOrganisationPage } from '@qa/fixtures/pages/org/IndividualOrganisationPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

if (isUK()) {
  // Skip test on UK
  base.skip()
} else {
  const allowedUsers = ['admin', 'ops', 'salesAdmin']

  allowedUsers.forEach(allowedUser => {
    const dataSet = [
      {
        user: `${allowedUser}`,
        smoke: allowedUser === 'admin' ? '@smoke' : '',
        orgName: 'Australia Main Organisation',
        isAffiliated: false,
      },
    ]

    for (const data of dataSet) {
      const test = base.extend<{ orgs: { id: string; name: string }[] }>({
        orgs: async ({}, use) => {
          const firstOrgName = 'Australia Third Affiliate Organisation'
          const secondOrgName = 'Australia Fourth Affiliate Organisation'
          const orgs = await Promise.all([
            API.organization.insertOrganization(
              ORGANIZATION_INSERT(
                firstOrgName,
              ) as unknown as Organization_Insert_Input,
            ),
            API.organization.insertOrganization(
              ORGANIZATION_INSERT(
                secondOrgName,
              ) as unknown as Organization_Insert_Input,
            ),
          ])
          await use([
            { id: orgs[0], name: firstOrgName },
            { id: orgs[1], name: secondOrgName },
          ])
          await Promise.all([
            API.organization.deleteOrganization(orgs[0]),
            API.organization.deleteOrganization(orgs[1]),
          ])
        },
      })
      test.describe('ANZ tests', () => {
        if (isUK()) {
          // Skip test on UK
          test.skip()
        } else {
          test(`View affiliated organisations tab as ${data.user} ${data.smoke}`, async ({
            browser,
          }) => {
            const context = await browser.newContext({
              storageState: stateFilePath(data.user as StoredCredentialKey),
            })
            const page = await context.newPage()

            const individualOrgPage = new IndividualOrganisationPage(page)
            const orgId = await API.organization.getOrganizationId(data.orgName)
            await individualOrgPage.goto(orgId)

            await individualOrgPage.clickAffiliatedOrgsTab()
          })

          test(`Add and remove affiliates from affiliated organisations tab as ${data.user} ${data.smoke}`, async ({
            browser,
            orgs,
          }) => {
            const context = await browser.newContext({
              storageState: stateFilePath(data.user as StoredCredentialKey),
            })
            const page = await context.newPage()

            const individualOrgPage = new IndividualOrganisationPage(page)
            const orgId = await API.organization.getOrganizationId(data.orgName)
            await individualOrgPage.goto(orgId)

            await individualOrgPage.clickAffiliatedOrgsTab()

            await individualOrgPage.addAnAffiliate(orgs[0].id, orgs[0].name)
            await individualOrgPage.addAnAffiliate(orgs[1].id, orgs[1].name)
            await individualOrgPage.unlinkOrgFromTableRow(orgs[0].id)
            await individualOrgPage.unlinkOrgFromManageSelected(orgs[1].id)
          })
        }
      })
    }
  })
}
