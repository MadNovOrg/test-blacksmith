import { BasePage } from '../BasePage.fixture'

export class BookingDetailsPage extends BasePage {
  readonly openPromoCodeFormButton = this.page.getByRole('button', {
    name: /apply promo or voucher code/i,
  })
  readonly promoCodeInput = this.page.getByLabel('Enter promo code')
  readonly applyPromoCodeButton = this.page.getByRole('button', {
    name: 'Apply',
    exact: true,
  })
  readonly promoCodeDiscountAmount = this.page.getByTestId(
    'promo-code-discount',
  )
  readonly amountDue = this.page.getByTestId('amount-due')

  async goto(id?: string) {
    await this.page.route(/.*\/v1\/graphql/, async route => {
      const request = route.request()

      if (JSON.stringify(request.postDataJSON()).includes('GetCoursePricing')) {
        await route.fulfill({
          json: {
            data: {
              pricing: {
                priceAmount: 200,
                priceCurrency: 'GBP',
                xeroCode: 'LEVEL1.OP',
                __typename: 'GetCoursePricingOutput',
              },
            },
          },
        })
      } else if (
        JSON.stringify(request.postDataJSON()).includes('CanApplyPromoCode')
      ) {
        await route.fulfill({
          json: {
            data: {
              canApplyPromoCode: {
                result: {
                  code: '5_PERCENT_OFF',
                  amount: 5,
                  type: 'PERCENT',
                  __typename: 'PromoCodeOutput',
                },
                __typename: 'CanApplyPromoCodeOutput',
              },
            },
          },
        })
      } else {
        route.continue()
      }
    })

    await super.goto(`registration${id ? `?course_id=${id}&quantity=1` : ''}`)
  }
}
