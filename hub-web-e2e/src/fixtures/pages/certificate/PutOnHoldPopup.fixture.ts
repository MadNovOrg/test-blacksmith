import { Locator, Page } from '@playwright/test'

import { getFormattedDate } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

import { CertificatePage } from './CertificatePage.fixture'

export class PutOnHoldPopup extends BasePage {
  readonly reasonInput: Locator
  readonly fromDate: Locator
  readonly toDate: Locator
  readonly submitButton: Locator
  readonly notes: Locator
  readonly reasonDropdown: (reason: string) => Locator

  constructor(page: Page) {
    super(page)
    this.reasonInput = this.page.locator('[data-testid=reason-input]')
    this.fromDate = this.page.locator('[data-testid=DateFrom] input')
    this.toDate = this.page.locator('[data-testid=DateTo] input')
    this.submitButton = this.page.locator('[data-testid=submit-on-hold]')
    this.notes = this.page.locator('[data-testid=add-notes] input')
    this.reasonDropdown = (reason: string) =>
      this.page.locator(`[data-testid=hold-reason-option-${reason}]`)
  }

  async selectReason(reason = 'MATERNITY') {
    await this.reasonInput.click()
    await this.reasonDropdown(reason).click()
  }

  async addNotes(notes = 'Simple notes to be added') {
    await this.notes.type(notes)
  }

  async selectFromDate(daysToAdd = 0) {
    await this.fromDate.click()
    await this.fromDate.type(getFormattedDate(daysToAdd))
  }

  async selectToDate(daysToAdd = 365) {
    await this.toDate.click()
    await this.toDate.type(getFormattedDate(daysToAdd))
  }

  async submitOnHold(): Promise<CertificatePage> {
    await this.submitButton.click()
    return new CertificatePage(this.page)
  }
}
