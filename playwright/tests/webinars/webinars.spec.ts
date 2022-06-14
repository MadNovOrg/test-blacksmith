/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { getWebinars } from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const PER_PAGE = 12

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
  await page.waitForLoadState('networkidle')

  const featuredVideoItemImage = page.locator(
    '[data-testid="featured-webinar"] img'
  )

  test
    .expect(featuredVideoItemImage)
    .toHaveAttribute(
      'src',
      webinars[0]?.featuredImage?.node?.mediaItemUrl ?? ''
    )
  test
    .expect(
      page.locator(
        `data-testid=featured-webinar >> text="${webinars[0]?.title}"`
      )
    )
    .toBeVisible()

  test
    .expect(page.locator(`data-testid=webinar-grid-item-${webinars[1]?.id}`))
    .toBeVisible()

  if (webinars.length > PER_PAGE) {
    test
      .expect(page.locator('data-testid=video-series-pagination'))
      .toBeVisible()
  }
})
