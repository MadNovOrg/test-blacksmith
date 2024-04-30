import { Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

export class NewDiscountPage extends BasePage {
  readonly discountCodeInput = this.page.getByPlaceholder(/discount code/i)
  readonly discountCodeDescriptionInput = this.page.getByPlaceholder(
    /description \(optional\)/i
  )
  readonly appliesToOptions: {
    allCourses: Locator
    specificLevels: Locator
    specificCourses: Locator
  }

  readonly startDateInput = this.page.getByTestId('fld-validFrom')
  readonly endDateInput = this.page.getByTestId('fld-validTo')

  readonly usageCriteriaCheckboxes: {
    limitPerBooker: Locator
    limitUses: Locator
  }

  readonly cancelButton = this.page.getByRole('button', { name: /cancel/i })
  readonly createDiscountButton = this.page.getByRole('button', {
    name: /create discount/i,
  })

  constructor(page: Page) {
    super(page)
    this.appliesToOptions = {
      allCourses: this.page.getByTestId('appliesTo-ALL'),
      specificLevels: this.page.getByTestId('appliesTo-LEVELS'),
      specificCourses: this.page.getByTestId('appliesTo-COURSES'),
    }

    this.usageCriteriaCheckboxes = {
      limitPerBooker: this.page.getByLabel(
        /Limit to one time use per booker email/i
      ),
      limitUses: this.page.getByLabel(
        /Limit number of bookings this discount can be used/i
      ),
    }
  }

  async goto() {
    await super.goto('admin/discounts/new')
  }
}
