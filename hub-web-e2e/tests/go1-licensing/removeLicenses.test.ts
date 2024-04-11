import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{
  orgId: string
}>({
  orgId: async ({}, use) => {
    const id = await API.organization.insertOrganization(UNIQUE_ORGANIZATION())
    await use(id)
    // setting small timeout as there is some race condition
    // between finishing the test and cleaning up the data
    // don't know the reason for it
    await setTimeout(100)
    await API.organization.deleteOrganization(id)
  },
})

test.use({ storageState: stateFilePath('admin') })

const removeLicenses = async (
  orgPage: AllOrganisations,
  orgId: string
): Promise<void> => {
  await orgPage.gotoOrganisation(orgId)
  await orgPage.clickBlendedLearningLicences()
  await orgPage.expectLicencesRemaining('10')
  await orgPage.clickManageButton()
  await orgPage.checkRemoveCheckbox()
  await orgPage.fillNumberOfLicences('5')
  await orgPage.fillInvoiceNotes('This is a note')
  await orgPage.clickSaveDetails()
  await orgPage.expectLicencesRemaining('5')
}

test('licenses can be removed by admin', async ({ browser, orgId }) => {
  const salesAdminContext = await browser.newContext({
    storageState: stateFilePath('admin'),
  })
  const page = await salesAdminContext.newPage()

  const orgPage = new AllOrganisations(page)
  await removeLicenses(orgPage, orgId)
})

test('licenses can be removed by sales-admin', async ({ browser, orgId }) => {
  const salesAdminContext = await browser.newContext({
    storageState: stateFilePath('salesAdmin'),
  })
  const page = await salesAdminContext.newPage()

  const orgPage = new AllOrganisations(page)
  await removeLicenses(orgPage, orgId)
})

test('licenses can be removed by ops', async ({ browser, orgId }) => {
  const salesAdminContext = await browser.newContext({
    storageState: stateFilePath('ops'),
  })
  const page = await salesAdminContext.newPage()

  const orgPage = new AllOrganisations(page)
  await removeLicenses(orgPage, orgId)
})
