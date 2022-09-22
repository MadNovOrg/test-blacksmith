/* eslint-disable no-empty-pattern */
import { setTimeout } from 'timers/promises'

import { test as base } from '@playwright/test'

import { deleteOrganization, insertOrganization } from '../..//api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

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
  await page.goto(`${BASE_URL}/organizations/${orgId}`)
  await page.waitForLoadState('networkidle')

  await page.click('button:has-text("Blended learning licences")')

  test.expect(page.locator('data-testid=licenses-remaining')).toHaveText('0')

  await page.click('button:has-text("Manage")')

  await page.locator('text=Number of licenses *').fill('20')
  await page.locator('text=Invoice number *').fill('INV.123-test')
  await page.locator('text=Add a note (optional)').fill('This is a note')

  await page.locator('button:has-text("Save details")').click()
  await page.waitForLoadState('networkidle')

  test.expect(page.locator('data-testid=licenses-remaining')).toHaveText('20')
})
