import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

import { CertificatePage } from './CertificatePage.fixture'

export class RevokeCertificatePopup extends BasePage {
  readonly reasonDropdown: Locator
  readonly reasonDropdownOtherOption: Locator
  readonly reasonInput: Locator
  readonly checkbox: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.reasonDropdown = this.page.locator(
      '[data-testid=revoke-reason-select]',
    )
    this.reasonDropdownOtherOption = this.page.locator(
      '[data-testid=other-dropdown-option]',
    )
    this.reasonInput = this.page.locator('[data-testid=specify-reason] input')
    this.checkbox = this.page.locator('[data-testid=revoke-checkbox]')
    this.submitButton = this.page.locator('[data-testid=confirm-button]')
  }

  async selectReasonDropdown() {
    await this.reasonDropdown.click()
    await this.reasonDropdownOtherOption.click()
  }

  async addAReason(reason: string) {
    await this.reasonInput.type(reason)
  }

  async tickCheckBox() {
    await this.checkbox.check()
  }

  async submitRevokePopup(): Promise<CertificatePage> {
    await this.submitButton.click()
    return new CertificatePage(this.page)
  }
}
