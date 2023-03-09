/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { getWebinars } from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL, PER_PAGE } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  webinars: Awaited<ReturnType<typeof getWebinars>>
}>({
  webinars: async ({}, use) => {
    const webinars = await getWebinars()

    await use(webinars)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays webinars with featured and grid display', async ({
  page,
  webinars,
}) => {
  await page.goto(`${BASE_URL}/membership/webinars`)
  await waitForPageLoad(page)

  const featuredVideoItemImage = page.locator(
    '[data-testid="featured-webinar"] img'
  )

  await test.expect(featuredVideoItemImage).toBeVisible({ timeout: 60000 })

  await test
    .expect(featuredVideoItemImage)
    .toHaveAttribute(
      'src',
      webinars[0]?.featuredImage?.node?.mediaItemUrl ?? ''
    )
  await test
    .expect(
      page.locator(
        `data-testid=featured-webinar >> text="${webinars[0]?.title}"`
      )
    )
    .toBeVisible({ timeout: 60000 })

  await test
    .expect(page.locator(`data-testid=webinar-grid-item-${webinars[1]?.id}`))
    .toBeVisible({ timeout: 60000 })

  // eslint-disable-next-line playwright/no-conditional-in-test
  if (webinars.length > PER_PAGE) {
    await test
      .expect(page.locator('data-testid=video-series-pagination'))
      .toBeVisible({ timeout: 60000 })
  }
})
