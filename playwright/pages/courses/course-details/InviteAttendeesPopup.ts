import { Locator, Page } from '@playwright/test'

import { BasePage } from '../../BasePage'

export class InviteAttendeesPopUp extends BasePage {
  readonly emailInput: Locator
  readonly sendButton: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = this.page.locator(
      '[data-testid="modal-invites-emails"] input'
    )
    this.sendButton = this.page.locator('data-testid=modal-invites-send')
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
