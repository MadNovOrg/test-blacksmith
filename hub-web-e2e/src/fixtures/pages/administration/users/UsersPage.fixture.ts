import { UiTable } from '@qa/fixtures/components/UiTable.fixture'

import { BasePage } from '../../BasePage.fixture'

import { MergeUsersPage } from './merge/MergeUsersPage.fixture'

export class UsersPage extends BasePage {
  readonly searchInput = this.page.getByPlaceholder('Search')
  readonly mergeUsersButton = this.page.getByRole('button', {
    name: 'Merge Users',
    exact: true,
  })
  readonly table = new UiTable(this.page.getByRole('table'))

  override async goto() {
    super.goto('admin/users')
  }

  async gotoMergeUsers() {
    await this.mergeUsersButton.click()
    return new MergeUsersPage(this.page)
  }
}
