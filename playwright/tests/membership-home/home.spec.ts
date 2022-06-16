import { test } from '@playwright/test'

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
  await page.waitForLoadState('networkidle')

  contentTypes.forEach(type => {
    test.expect(page.locator(`data-testid=${type}-grid-title`)).toBeVisible()

    test
      .expect(page.locator(`data-testid=${type}-grid >> [data-grid-item="0"]`))
      .toBeVisible()
  })
})
