import { BasePage } from '../BasePage.fixture'

export class BookingDetailsPage extends BasePage {
  readonly openPromoCodeFormButton = this.page.getByRole('button', {
    name: /apply promo or voucher code/i,
  })
  readonly promoCodeInput = this.page.getByLabel('Promo code')
  readonly applyPromoCodeButton = this.page.getByRole('button', {
    name: 'Apply',
    exact: true,
  })
  readonly promoCodeDiscountAmount = this.page.getByTestId(
    'promo-code-discount',
  )
  readonly amountDue = this.page.getByTestId('amount-due')

  async goto(id?: string) {
    await super.goto(`registration${id ? `?course_id=${id}&quantity=1` : ''}`)
  }
}
