import { test, expect } from '@playwright/test'

import * as API from '@qa/api'
import { MERGE_USER1_EMAIL, MERGE_USER2_EMAIL } from '@qa/api/hasura/users'
import { CompareUsersDialog } from '@qa/fixtures/pages/administration/users/merge/CompareUsersDialog.fixture'
import { MergeUserRow } from '@qa/fixtures/pages/administration/users/merge/MergeUserRow.fixture'
import { MergeUsersPage } from '@qa/fixtures/pages/administration/users/merge/MergeUsersPage.fixture'
import { UsersPage } from '@qa/fixtures/pages/administration/users/UsersPage.fixture'
import { stateFilePath } from '@qa/util'

test.use({ storageState: stateFilePath('admin') })

// eslint-disable-next-line playwright/expect-expect
test('Should redirect to the merge users page when clicking on the merge users button', async ({
  page,
}) => {
  const usersPage = new UsersPage(page)
  await usersPage.goto()

  await usersPage.gotoMergeUsers()
  await page.waitForURL(/.*\/admin\/users\/merge/)
})

test('Should enable the "Merge Users" button when exactly 2 users are selected', async ({
  page,
}) => {
  const mergeUsersPage = new MergeUsersPage(page)
  await mergeUsersPage.goto()

  const mergeButton = mergeUsersPage.mergeSelectedButton

  await expect(mergeButton).toBeDisabled()

  await mergeUsersPage.toggleRowByIndex(0)
  await expect(mergeButton).toBeDisabled()

  await mergeUsersPage.toggleRowByIndex(1)
  await expect(mergeButton).toBeEnabled()

  await mergeUsersPage.toggleRowByIndex(2)
  await expect(mergeButton).toBeDisabled()
})

test.describe('Merge Users Dialog', () => {
  test.describe.configure({
    mode: 'serial',
  })
  let mergeUsersPage: MergeUsersPage
  let dialog: CompareUsersDialog

  test.beforeEach(async ({ page }) => {
    await API.users.cleanupMergeUsers()
    await API.users.createMergeUsers()

    mergeUsersPage = new MergeUsersPage(page)
    await mergeUsersPage.goto()
    await mergeUsersPage.searchInput.fill('merge.e2e')
    await expect(mergeUsersPage.muiProgressCircle).toBeHidden()
    await expect(mergeUsersPage.table.rows).toHaveCount(2)
    await mergeUsersPage.toggleRowByIndex(0)
    await mergeUsersPage.toggleRowByIndex(1)

    await mergeUsersPage.mergeSelectedButton.click()
    dialog = new CompareUsersDialog(page)
  })

  test('Should open the merge dialog when clicking on the "Merge Users" button', async () => {
    await expect(dialog.locator).toBeVisible()
  })

  test('Should not allow merging before the main user is selected and the checkbox is checked', async () => {
    await expect(dialog.continueButton).toBeDisabled()
    await dialog.primaryUserRadios.user1.click()

    await expect(dialog.continueButton).toBeDisabled()
    await dialog.confirmCheckbox.click()

    await expect(dialog.continueButton).toBeEnabled()
  })

  test.skip('Should prioritize attributes of the first user when merging if they are selected in the dialog', async () => {
    await dialog.primaryUserRadios.user1.click()
    await dialog.confirmCheckbox.click()
    await dialog.continueButton.click()
    await expect(mergeUsersPage.table.rows).toHaveCount(1)

    const mergeUserRow = new MergeUserRow(mergeUsersPage.table.rows.first())
    await expect(mergeUserRow.name).toHaveText('Merge E2E 1')
    await expect(mergeUserRow.email).toHaveText(MERGE_USER1_EMAIL)
    const roles = await mergeUserRow.roles.allTextContents()
    expect(roles).toEqual(['Individual', 'Trainer', 'Sales Administrator'])
  })

  test.skip('Should prioritize attributes of the second user when merging if they are selected in the dialog', async () => {
    await dialog.primaryUserRadios.user2.click()
    await dialog.confirmCheckbox.click()
    await dialog.continueButton.click()
    await expect(mergeUsersPage.table.rows).toHaveCount(1)

    const mergeUserRow = new MergeUserRow(mergeUsersPage.table.rows.first())
    await expect(mergeUserRow.name).toHaveText('Merge E2E 2')
    await expect(mergeUserRow.email).toHaveText(MERGE_USER2_EMAIL)
    const roles = await mergeUserRow.roles.allTextContents()
    expect(roles).toEqual(['Sales Administrator', 'Individual', 'Trainer'])
  })
})
