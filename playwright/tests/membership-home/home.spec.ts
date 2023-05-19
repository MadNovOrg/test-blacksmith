import { test } from '@playwright/test'

import { stateFilePath } from '@qa/hooks/global-setup'
import { MembershipPage } from '@qa/pages/membership/MembershipPage'

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
  const membershipPage = new MembershipPage(page)
  await membershipPage.goto()
  await membershipPage.checkGridItem(contentTypes)
})
