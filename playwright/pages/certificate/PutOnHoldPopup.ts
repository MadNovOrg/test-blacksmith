import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

import { CertificatePage } from './CertificatePage'

export class PutOnHoldPopup extends BasePage {
  readonly reasonDropdown: Locator
  readonly reasonInput: Locator
  readonly fromDate: Locator
  readonly toDate: Locator
  readonly submitButton: Locator
  readonly notes: Locator

  constructor(page: Page) {
    super(page)
    this.reasonInput = this.page.locator('[data-testid=reason-input]')
    this.reasonDropdown = this.page.locator(
      '[data-testid=hold-reason-option-MATERNITY]'
    )
    this.fromDate = this.page.locator('[data-testid=DateFrom] input')
    this.toDate = this.page.locator('[data-testid=DateTo] input')
    this.submitButton = this.page.locator('[data-testid=submit-on-hold]')
    this.notes = this.page.locator('[data-testid=add-notes] input')
  }

  async selectReason() {
    await this.reasonInput.click()
    await this.reasonDropdown.click()
  }

  async addNotes(notes: string) {
    await this.notes.type(notes)
  }

  async selectFromDate() {
    await this.fromDate.click()
    await this.fromDate.type('10122023')
  }

  async selectToDate() {
    await this.toDate.click()
    await this.toDate.type('10012024')
  }

  async submitOnHold(): Promise<CertificatePage> {
    await this.submitButton.click()
    return new CertificatePage(this.page)
  }
}
