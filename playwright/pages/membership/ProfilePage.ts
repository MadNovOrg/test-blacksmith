import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class ProfilePage extends BasePage {
  readonly editProfile: Locator
  readonly saveChanges: Locator

  constructor(page: Page) {
    super(page)
    this.editProfile = this.page.locator('data-testid=edit-profile')
    this.saveChanges = this.page.locator('data-testid=profile-save-changes')
  }

  async goto(profileId: string, orgId?: string) {
    await super.goto(
      orgId
        ? `${BASE_URL}/profile/${profileId}?orgId=${orgId}`
        : `${BASE_URL}/profile/${profileId}`
    )
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

  async clickSaveChanges() {
    await this.saveChanges.click()
    await super.waitForPageLoad()
  }
}
