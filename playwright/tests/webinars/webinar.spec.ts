/* eslint-disable no-empty-pattern */
import { expect, test as base } from '@playwright/test'

import { getWebinarById, getWebinars } from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  data: {
    webinar: Awaited<ReturnType<typeof getWebinarById>>
    recentWebinars: Awaited<ReturnType<typeof getWebinars>>
  }
}>({
  data: async ({}, use) => {
    const recentWebinars = await getWebinars(4)
    const webinar = await getWebinarById(recentWebinars[0]?.id ?? '')

    await use({ webinar, recentWebinars })
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video item details and recent items', async ({ page, data }) => {
  if (!data.webinar) {
    return test.fail()
  }

  await page.goto(`${BASE_URL}/membership/webinars/${data.webinar.id}`)
  await page.waitForLoadState('networkidle')

  await expect(page.locator(`data-testid=webinar-title`)).toHaveText(
    data.webinar.title ?? ''
  )

  const ytFrame = page.frameLocator(`#yt-embed-${data.webinar.id}`)

  await ytFrame.locator('[aria-label="Play"]').click()

  data.recentWebinars.map(async recentItem => {
    if (!recentItem) {
      return
    }

    await expect(
      page.locator(`data-testid=webinars-grid-item-${recentItem.id}`)
    ).toBeVisible()
  })
})
