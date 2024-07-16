/* eslint-disable playwright/expect-expect */
import { test } from '@playwright/test'

import * as API from '@qa/api'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/util'

test.use({ storageState: stateFilePath('admin') })

test('add new organisation as admin', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.goto()
  await orgPage.clickSeeAllOrganisations()
  await orgPage.clickNewOrganisation()
  const orgName = await orgPage.addNewOrganisationName()
  await orgPage.selectSector()
  await orgPage.selectType()
  await orgPage.addPhoneNumber()
  await orgPage.addEmail()
  await orgPage.addLine1()
  await orgPage.addCity()
  await orgPage.addPostCode()
  await orgPage.addWorkEmail()
  await orgPage.clickSaveOrganisation()

  await orgPage.checkNewOrgPage()

  const orgId = await API.organization.getOrganizationId(orgName)
  await API.organization.deleteOrganization(orgId)
})

test('add new international organisation as admin', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.goto()
  await orgPage.clickSeeAllOrganisations()
  await orgPage.clickNewOrganisation()
  const orgName = await orgPage.addNewOrganisationName()
  await orgPage.selectSector()
  await orgPage.selectType()
  await orgPage.addPhoneNumber()
  await orgPage.addEmail()
  await orgPage.addCountry('Albania')
  await orgPage.addLine1()
  await orgPage.addCity()
  await orgPage.addWorkEmail()
  await orgPage.clickSaveOrganisation()

  await orgPage.checkNewOrgPage()
  const orgId = await API.organization.getOrganizationId(orgName)
  await API.organization.deleteOrganization(orgId)
})
