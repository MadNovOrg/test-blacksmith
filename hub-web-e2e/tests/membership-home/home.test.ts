import { test } from '@playwright/test'

import { MembershipPage } from '@qa/fixtures/pages/membership/MembershipPage.fixture'
import { stateFilePath } from '@qa/util'

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
  test.skip()
  const membershipPage = new MembershipPage(page)
  await membershipPage.goto()
  await membershipPage.checkGridItem(contentTypes)
})
