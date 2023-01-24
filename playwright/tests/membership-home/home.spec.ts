import { test } from '@playwright/test'

import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

test.use({ storageState: stateFilePath('trainer') })

const contentTypes = [
  'blog',
  'webinars',
  'video-series',
  'podcasts',
  'ebooks',
  'research-summaries',
]

test('displays grid for all content types', async ({ page }) => {
  await page.goto(`${BASE_URL}/membership`)
  await waitForPageLoad(page)

  contentTypes.forEach(async type => {
    await test
      .expect(page.locator(`data-testid=${type}-grid-title`))
      .toBeVisible()

    await test
      .expect(page.locator(`data-testid=${type}-grid >> [data-grid-item="0"]`))
      .toBeVisible()
  })
})
