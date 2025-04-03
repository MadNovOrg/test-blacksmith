/* eslint-disable playwright/expect-expect */
/* eslint-disable playwright/no-skipped-test */
import { test } from '@playwright/test'

import { Organisation_Sector_Enum } from '@app/generated/graphql'

import { isUK } from '@qa/constants'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { OrganisationListPage } from '@qa/fixtures/pages/org/OrganisationsList.fixture'
import { stateFilePath, StoredCredentialKey, sectors } from '@qa/util'

if (isUK()) {
  // Skip test on UK
  test.skip()
} else {
  const allowedUsers = ['admin', 'ops', 'salesAdmin']

  allowedUsers.forEach(allowedUser => {
    const dataSet = [
      {
        user: `${allowedUser}`,
        smoke: allowedUser === 'admin' ? '@smoke' : '',
      },
    ]
    for (const data of dataSet) {
      test(`View organisations list page as ${data.user} ${data.smoke}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const allOrgsPage = new AllOrganisations(page)
        await allOrgsPage.goto()
        const orgListPage = await allOrgsPage.clickSeeAllOrganisationsButton()
        await orgListPage.checkOrgListPage()
      })

      test(`Apply each filter individually on organisations list page as ${data.user} ${data.smoke}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const orgListPage = new OrganisationListPage(page)
        await orgListPage.goto()

        await orgListPage.checkSearchFilter('Team Teach', 'London First School')
        await orgListPage.clearSearchTextbox()

        await orgListPage.toggleSectorFilter()
        await orgListPage.checkSectorFilter(
          Organisation_Sector_Enum.AnzEdu,
          'Education',
        )
        await orgListPage.clearSectorFilter(Organisation_Sector_Enum.AnzEdu)

        await orgListPage.toggleCountryFilter()
        await orgListPage.checkCountryFilter('Australia', 'AU')
        await orgListPage.clearCountryFilter('AU')
      })

      test(`Apply multiple filters on organisations list page as ${data.user} ${data.smoke}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const orgListPage = new OrganisationListPage(page)
        await orgListPage.goto()

        // Apply search
        await orgListPage.checkSearchFilter(
          'Organisation',
          'Example organization',
        )

        // Apply multiple sector filters
        await orgListPage.toggleSectorFilter()
        await orgListPage.checkSectorFilter(
          Organisation_Sector_Enum.AnzEdu,
          sectors.anz_edu,
        )
        await orgListPage.checkSectorFilter(
          Organisation_Sector_Enum.AnzSs,
          sectors.anz_ss,
        )

        //Apply multiple country filters
        await orgListPage.toggleCountryFilter()
        await orgListPage.checkCountryFilter('Australia', 'AU')
        await orgListPage.checkCountryFilter('New Zealand', 'NZ')
      })

      test(`Apply filters and check affiliated orgs on organisations list page as ${data.user} ${data.smoke}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          storageState: stateFilePath(data.user as StoredCredentialKey),
        })
        const page = await context.newPage()
        const orgListPage = new OrganisationListPage(page)
        await orgListPage.goto()

        // Apply country filter
        await orgListPage.toggleCountryFilter()
        await orgListPage.checkCountryFilter('Australia', 'AU')

        // Expand first organisation row
        await orgListPage.expandOrganisationRow(0)

        // Check affiliates count for the first organisation before filtering affiliates
        await orgListPage.checkAffiliatesChipCount(0, 2, 2)

        // Apply search filter for affiliated org
        await orgListPage.checkSearchFilter(
          'Australia Second Affiliated Organisation',
          'Australia First Affiliated Organisation',
        )

        // Check affiliates count for the first organisation after filtering affiliates
        await orgListPage.checkAffiliatesChipCount(0, 1, 2)
      })
    }
  })
}
