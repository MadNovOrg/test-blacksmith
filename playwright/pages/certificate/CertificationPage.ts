import { Locator, Page } from '@playwright/test'

import { UiTable } from '../../components/UiTable'
import { BasePage } from '../BasePage'
import { ProfilePage } from '../membership/ProfilePage'

import { CertificatePage } from './CertificatePage'

export class CertificationPage extends BasePage {
  readonly name: Locator
  readonly table: UiTable

  constructor(page: Page) {
    super(page)
    this.name = this.page.locator('[data-testid=name]')
    this.table = new UiTable(
      this.page.locator('[data-testid=certification-table]')
    )
  }

  async goto(id?: string) {
    await super.goto(`certifications${id ? `?q=${id}` : ''}`)
  }

  async getFirstCertificate() {
    return this.table.firstRow
      .locator('[data-testid=certificate-number]')
      .textContent()
  }

  async clickFirstUser() {
    await this.table.firstRow.locator('[data-testid=name]').click()
    return new ProfilePage(this.page)
  }

  async clickFirstViewCertificate() {
    await this.table.firstRow.locator('[data-testid=view-certificate]').click()
    return new CertificatePage(this.page)
  }
}
