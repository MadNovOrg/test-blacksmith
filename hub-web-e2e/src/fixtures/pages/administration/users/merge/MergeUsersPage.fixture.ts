import { Locator } from '@playwright/test'

import { UiTable } from '@qa/fixtures/components/UiTable.fixture'
import { BasePage } from '@qa/fixtures/pages/BasePage.fixture'

import { MergeUserRow } from './MergeUserRow.fixture'

export class MergeUsersPage extends BasePage {
  readonly searchInput = this.page.locator('[data-testid="FilterSearch-Input"]')
  readonly mergeSelectedButton = this.page.getByRole('button', {
    name: /merge selected/i,
  })
  readonly table = new UiTable(this.page.getByRole('table'))

  override async goto() {
    super.goto('admin/users/merge')
  }

  async toggleRow(rowLocator: Locator) {
    const mergeUserRow = new MergeUserRow(rowLocator)
    await mergeUserRow.checkbox.click()
  }

  async toggleRowByIndex(index: number) {
    await this.toggleRow(this.table.rows.nth(index))
  }
}
