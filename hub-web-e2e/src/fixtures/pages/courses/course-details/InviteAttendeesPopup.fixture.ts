import { Page } from '@playwright/test'

import { BasePage } from '@qa/fixtures/pages/BasePage.fixture'

export class InviteAttendeesPopUp extends BasePage {
  readonly emailInput = this.page.locator(
    '[data-testid="modal-invites-emails"] input',
  )
  readonly sendButton = this.page.locator('data-testid=modal-invites-send')
  readonly error = this.page.locator('.Mui-error')

  constructor(page: Page) {
    super(page)
  }

  async enterEmails(emails: string[]) {
    for (const email of emails) {
      await this.emailInput.fill(email)
      await this.emailInput.press('Enter')
    }
  }

  async clickSendButton() {
    await this.sendButton.click()
  }
}
