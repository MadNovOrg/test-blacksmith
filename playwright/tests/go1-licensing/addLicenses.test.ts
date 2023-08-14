import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

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

const allowedRoles: string[] = ['admin', 'ops', 'salesAdmin']
allowedRoles.forEach(role => {
  test.use({ storageState: stateFilePath(role) })

  test(`${role} can add licenses`, async ({ page, orgId }) => {
    const orgPage = new AllOrganisations(page)
    await orgPage.gotoOrganisation(orgId)
    await orgPage.clickBlendedLearningLicences()
    await orgPage.expectLicencesRemaining('10')
    await orgPage.clickManageButton()
    await orgPage.fillNumberOfLicences('10')
    await orgPage.fillInvoiceNumber('INV.123-test')
    await orgPage.fillInvoiceNotes('This is a note')
    await orgPage.clickSaveDetails()
    await orgPage.expectLicencesRemaining('20')
  })
})
