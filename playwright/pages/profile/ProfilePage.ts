import { expect, Locator, Page } from '@playwright/test'

import { waitForGraphQLRequest } from '../../commands'
import { BasePage } from '../BasePage'
import { CertificationPage } from '../certificate/CertificationPage'

export class ProfilePage extends BasePage {
  readonly editProfile: Locator
  readonly saveChanges: Locator
  readonly certificateButton: Locator
  readonly phoneNumberField: Locator
  readonly viewPhoneNumber: Locator

  constructor(page: Page) {
    super(page)
    this.editProfile = this.page.locator('data-testid=edit-profile')
    this.saveChanges = this.page.locator('data-testid=profile-save-changes')
    this.certificateButton = this.page.locator(
      `[data-testid*=certificate] button`
    )
    this.phoneNumberField = this.page.locator('[data-testid="phone"]')
    this.viewPhoneNumber = this.page.locator('[data-testid="profile-phone"]')
  }

  async goto(profileId?: string, orgId?: string) {
    if (orgId) {
      await super.goto(`profile/${profileId}?orgId=${orgId}`)
    } else {
      await super.goto(`profile/${profileId ?? ''}`)
    }
  }

  async clickEditButton() {
    await this.editProfile.click()
  }

  async enterPhoneNumber(phoneNumber: string) {
    await this.phoneNumberField.clear()
    await this.phoneNumberField.type(phoneNumber)
    await expect(this.phoneNumberField).toHaveValue(phoneNumber)
  }

  async clickSaveChanges() {
    await Promise.all([
      waitForGraphQLRequest(this.page, 'UpdateProfile'),
      this.saveChanges.click(),
      super.waitForPageLoad(),
    ])
  }

  async checkPhoneNumber(phoneNumber: string) {
    await expect(this.viewPhoneNumber).toHaveText(phoneNumber)
  }

  async checkLicenceIdExists(licenseId: string, exists: boolean) {
    const locator = this.page.locator(`data-testid=go1-license-${licenseId}`)
    if (exists) {
      await expect(locator).toBeVisible()
    } else {
      await expect(locator).toBeHidden()
    }
  }

  async clickEditProfile() {
    await this.editProfile.click()
  }

  async clickRemoveLicenceById(licenseId: string) {
    await this.page.click(
      `data-testid=go1-license-${licenseId} >> button:has-text("Remove")`
    )
    await expect(
      this.page.locator(`data-testid=go1-license-${licenseId}`)
    ).toHaveCount(0)
  }

  async checkCertificate(certificateId: string | null) {
    await expect(
      this.page.locator(`data-testid=certificate-${certificateId}`)
    ).toBeVisible()
  }

  async clickFirstCertificate() {
    await this.certificateButton.first().click()
    return new CertificationPage(this.page)
  }
}
