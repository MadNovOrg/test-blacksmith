import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

export class CertificatePage extends BasePage {
  readonly certificateNumber: Locator

  constructor(page: Page) {
    super(page)
    this.certificateNumber = this.page.locator(
      '[data-testid=certificate-number]'
    )
  }
  async checkCertificate(certificateId: string | null) {
    await expect(this.certificateNumber).toContainText(certificateId ?? '')
  }
}
