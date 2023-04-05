import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

import { PutOnHoldPopup } from './PutOnHoldPopup'

export class CertificatePage extends BasePage {
  readonly certificateNumber: Locator
  readonly manageCertificateButton: Locator
  readonly putOnHoldMenuOption: Locator
  readonly onHoldAlert: Locator
  readonly viewDetails: Locator

  constructor(page: Page) {
    super(page)
    this.certificateNumber = this.page.locator(
      '[data-testid=certificate-number]'
    )
    this.manageCertificateButton = this.page.locator(
      '[data-testid=manage-certification-button]'
    )
    this.putOnHoldMenuOption = this.page.locator(
      '[data-testid=manage-certificate-hold-certificate]'
    )
    this.onHoldAlert = this.page.locator('[data-testid=on-hold-alert]')
    this.viewDetails = this.page.locator('[data-testid=view-details]')
  }

  async clickManageCertificateButton() {
    await this.manageCertificateButton.click()
  }

  async clickPutOnHold(): Promise<PutOnHoldPopup> {
    await this.putOnHoldMenuOption.click()
    return new PutOnHoldPopup(this.page)
  }

  async displaysOnHoldAlert() {
    await expect(this.onHoldAlert).toBeVisible()
  }

  async checkCertificate(certificateId: string | null) {
    await expect(this.certificateNumber).toContainText(certificateId ?? '')
  }

  async clickViewDetails() {
    await this.viewDetails.click()
  }
}
