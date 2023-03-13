import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import { deleteOrganization, insertOrganization } from '../..//api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { AllOrganisations } from '../../pages/org/AllOrganisations'

const test = base.extend<{
  orgId: string
}>({
  orgId: async ({}, use) => {
    const id = await insertOrganization({
      name: 'Test organization',
      go1Licenses: 10,
    })
    await use(id)
    // setting small timeout as there is some race condition
    // between finishing the test and cleaning up the data
    // don't know the reason for it
    await setTimeout(100)
    await deleteOrganization(id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test('licenses can be removed', async ({ page, orgId }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(orgId)
  await orgPage.clickBlendedLearningLicences()
  await orgPage.expectLicencesRemaining('10')
  await orgPage.clickManageButton()
  await orgPage.checkRemoveCheckbox()
  await orgPage.fillNumberOfLicences('5')
  await orgPage.fillInvoiceNotes('This is a note')
  await orgPage.clickSaveDetails()
  await orgPage.expectLicencesRemaining('5')
})
