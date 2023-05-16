import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import * as API from '../../api'
import { stateFilePath } from '../../hooks/global-setup'
import { AllOrganisations } from '../../pages/org/AllOrganisations'

const test = base.extend<{
  orgId: string
}>({
  orgId: async ({}, use) => {
    const id = await API.organization.insertOrganization({
      name: 'Test organization',
    })
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
    await orgPage.expectLicencesRemaining('0')
    await orgPage.clickManageButton()
    await orgPage.fillNumberOfLicences('20')
    await orgPage.fillInvoiceNumber('INV.123-test')
    await orgPage.fillInvoiceNotes('This is a note')
    await orgPage.clickSaveDetails()
    await orgPage.expectLicencesRemaining('20')
  })
})
