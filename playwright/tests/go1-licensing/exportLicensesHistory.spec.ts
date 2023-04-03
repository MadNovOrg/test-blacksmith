import { test as base } from '@playwright/test'

import { Go1_History_Events_Enum } from '@app/generated/graphql'

import * as API from '../../api'
import { stateFilePath } from '../../hooks/global-setup'
import { AllOrganisations } from '../../pages/org/AllOrganisations'

const test = base.extend<{ orgId: string }>({
  orgId: async ({}, use) => {
    const id = await API.organization.insertOrganization({
      name: 'Test organization',
    })
    await API.go1_licensing.insertGo1HistoryEvent({
      event: Go1_History_Events_Enum.LicensesAdded,
      balance: 10,
      change: 10,
      org_id: id,
      payload: {
        invoiceId: 'INV.001',
        invokedBy: 'John Doe',
      },
    })

    await use(id)
    await API.organization.deleteOrganization(id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test('export licenses as CSV', async ({ page, orgId }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(orgId)
  await orgPage.clickBlendedLearningLicences()
  await orgPage.checkExportOfLicences()
})
