import { Locator, Page } from '@playwright/test'

export type Questions = {
  rating: Locator
  boolean: Locator
  text: Locator
}

export const fillEvaluationForm = async (page: Page, questions: Questions) => {
  const [ratingQuestionsCount, booleanQuestionsCount, textQuestionsCount] =
    await Promise.all([
      questions.rating.count(),
      questions.boolean.count(),
      questions.text.count(),
    ])

  for (let i = 0; i < ratingQuestionsCount; ++i) {
    const question = questions.rating.nth(i)
    const rate = Math.round(Math.random() * 4) + 1
    await question
      .locator(`[data-rating="rating-${rate}"]`)
      // eslint-disable-next-line playwright/no-force-option
      .click({ force: true })
  }

  for (let i = 0; i < booleanQuestionsCount; ++i) {
    const question = questions.boolean.nth(i)
    const response = Math.round(Math.random()) ? 'yes' : 'no'
    await question.locator(`data-testid=rating-${response}`).click()
    if (response === 'yes') {
      await page
        .locator(`data-testid=rating-boolean-reason-${response}`)
        .locator('input')
        .fill('Reason')
    }
  }

  for (let i = 0; i < textQuestionsCount; ++i) {
    const question = questions.text.nth(i)
    await question.locator('input').fill('Response')
  }
}
