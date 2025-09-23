import { Locator, type Page } from '@playwright/test'

export class CompareUsersDialog {
  readonly locator = this.page.getByRole('dialog', { name: 'Compare Users' })
  readonly primaryUserRadios: {
    user1: Locator
    user2: Locator
  }
  readonly confirmCheckbox = this.locator.getByLabel(
    'I Confirm that I would like to merge these users',
  )
  readonly cancelButton = this.locator.getByRole('button', { name: 'Cancel' })
  readonly continueButton = this.locator.getByRole('button', {
    name: 'Continue',
  })

  constructor(readonly page: Page) {
    this.primaryUserRadios = {
      user1: this.locator.getByRole('radio').first(),
      user2: this.locator.getByRole('radio').last(),
    }
  }
}
