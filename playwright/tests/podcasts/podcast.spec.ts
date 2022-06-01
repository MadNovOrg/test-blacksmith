/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { Podcast } from '@app/generated/graphql'

import { getAllPodcasts, getPodcastById } from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{ podcast: Podcast | null }>({
  podcast: async ({}, use) => {
    const allPodcasts = await getAllPodcasts()

    const podcast = await getPodcastById(allPodcasts[0].id)

    await use(podcast)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test.describe('podcast page', () => {
  test('displays single podcast with the player', async ({ podcast, page }) => {
    await page.goto(`${BASE_URL}/membership/podcasts/${podcast?.id}`)

    test
      .expect(page.locator('data-testid=podcast-title'))
      .toHaveText(podcast?.name ?? '')

    await page.locator('data-testid=PlayCircleIcon').click()

    test.expect(page.locator('data-testid=PauseCircleIcon')).toBeVisible()

    test
      .expect(page.locator('data-testid=recent-podcasts >> [data-grid-item]'))
      .toHaveCount(4)
  })
})
