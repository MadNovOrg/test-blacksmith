import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

import { PutOnHoldPopup } from './PutOnHoldPopup'
import { RevokeCertificatePopup } from './RevokeCertificatePopup'

export class CertificatePage extends BasePage {
  readonly certificateNumber: Locator
  readonly manageCertificateButton: Locator
  readonly putOnHoldMenuOption: Locator
  readonly onHoldAlert: Locator
  readonly viewDetails: Locator
  readonly revokeCertMenuOption: Locator
  readonly revokeCertAlert: Locator

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
    this.revokeCertMenuOption = this.page.locator(
      '[data-testid=manage-certificate-revoke-certificate]'
    )
    this.revokeCertAlert = this.page.locator('[data-testid=revoked-cert-alert]')
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
  async clickRevokeCertificate(): Promise<RevokeCertificatePopup> {
    await this.revokeCertMenuOption.click()
    return new RevokeCertificatePopup(this.page)
  }
  async displayRevokeCertAlert() {
    await expect(this.revokeCertAlert).toBeVisible()
  }
}
