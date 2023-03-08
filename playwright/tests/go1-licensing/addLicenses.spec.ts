/* eslint-disable no-empty-pattern */
import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import { deleteOrganization, insertOrganization } from '../..//api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { AllOrganisations } from '../../pages/org/AllOrganisations'

const test = base.extend<{
  orgId: string
}>({
  orgId: async ({}, use) => {
    const id = await insertOrganization({ name: 'Test organization' })

    await use(id)

    // setting small timeout as there is some race condition
    // between finishing the test and cleaning up the data
    // don't know the reason for it
    await setTimeout(100)
    await deleteOrganization(id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test('licenses can be added', async ({ page, orgId }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(orgId)

  await page.click('button:has-text("Blended learning licences")')

  await test
    .expect(page.locator('data-testid=licenses-remaining'))
    .toHaveText('0')

  await page.click('button:has-text("Manage")')

  await page.locator('text=Number of licences *').fill('20')
  await page.locator('text=Invoice number *').fill('INV.123-test')
  await page.locator('text=Add a note (optional)').fill('This is a note')

  await page.locator('button:has-text("Save details")').click()
  await page.waitForLoadState('domcontentloaded')
  await test.expect(page.locator('role=progressbar')).toHaveCount(0)
  await test.expect(page.locator('.MuiSkeleton-pulse')).toHaveCount(0)

  test.expect(page.locator('data-testid=licenses-remaining')).toHaveText('20')
})
