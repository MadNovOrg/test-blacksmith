/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { getResearchSummaries } from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL, PER_PAGE } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  researchSummaries: Awaited<ReturnType<typeof getResearchSummaries>>
}>({
  researchSummaries: async ({}, use) => {
    const researchSummaries = await getResearchSummaries()

    await use(researchSummaries)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays research summaries with featured and grid display', async ({
  page,
  researchSummaries,
}) => {
  await page.goto(`${BASE_URL}/membership/research-summaries`)
  await waitForPageLoad(page)

  const featuredResearchSummary = page.locator(
    '[data-testid="featured-research-summary"] img'
  )

  await test
    .expect(featuredResearchSummary)
    .toHaveAttribute(
      'src',
      researchSummaries[0]?.featuredImage?.node?.mediaItemUrl ?? ''
    )
  await test
    .expect(
      page.locator(
        `data-testid=featured-research-summary >> text="${researchSummaries[0]?.title}"`
      )
    )
    .toBeVisible()

  await test
    .expect(
      page.locator(
        `data-testid=research-summary-grid-item-${researchSummaries[1]?.id}`
      )
    )
    .toBeVisible()

  const [donwload] = await Promise.all([
    page.waitForEvent('download'),
    page
      .locator(
        `data-testid=featured-research-summary >> text="Download resource"`
      )
      .click(),
  ])

  const path = await donwload.path()
  await test.expect(path).toBeTruthy()

  // eslint-disable-next-line playwright/no-conditional-in-test
  if (researchSummaries.length > PER_PAGE) {
    await test
      .expect(page.locator('data-testid=research-summaries-pagination'))
      .toBeVisible()
  }
})
