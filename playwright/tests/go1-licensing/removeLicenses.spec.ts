/* eslint-disable no-empty-pattern */
import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import { deleteOrganization, insertOrganization } from '../..//api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

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
  await page.goto(`${BASE_URL}/organisations/${orgId}`)
  await waitForPageLoad(page)

  await page.click('button:has-text("Blended learning licences")')

  await test
    .expect(page.locator('data-testid=licenses-remaining'))
    .toHaveText('10')

  await page.click('button:has-text("Manage")')

  await page.locator('label:has-text("Remove")').check()
  await page.locator('text=Number of licences *').fill('5')
  await page.locator('text=Add a note (optional)').fill('This is a note')

  await page.locator('button:has-text("Save details")').click()
  await page.waitForLoadState('domcontentloaded')

  await test
    .expect(page.locator('data-testid=licenses-remaining'))
    .toHaveText('5')
})
