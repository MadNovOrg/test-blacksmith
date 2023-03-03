import { test } from '@playwright/test'

import { stateFilePath } from '../../hooks/global-setup'
import { AllOrganisations } from '../../pages/org/AllOrganisations'

test.use({ storageState: stateFilePath('admin') })

test('add new organisation as admin', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.goto()
  await orgPage.clickSeeAllOrganisations()
  await orgPage.clickNewOrganisation()
  await orgPage.addNewOrganisationName()
  await orgPage.addTrustName()
  await orgPage.addLine1()
  await orgPage.addCity()
  await orgPage.addCountry()
  await orgPage.addPostCode()
  await orgPage.addWorkEmail()
  await orgPage.clickSaveOrganisation()
  await orgPage.goto()
  //check new org is on organisation summary table
  await orgPage.findNewOrg()
  await orgPage.checkNewOrgPage()
})
