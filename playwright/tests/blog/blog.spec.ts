/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { PostSummaryFragment } from '@app/generated/graphql'

import { getBlogPosts } from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const PER_PAGE = 12

const test = base.extend<{
  posts: (PostSummaryFragment | null)[]
}>({
  posts: async ({}, use) => {
    const posts = await getBlogPosts()

    await use(posts)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays posts with featured and grid display', async ({
  page,
  posts,
}) => {
  await page.goto(`${BASE_URL}/membership/blog`)
  await page.waitForLoadState('networkidle')

  const featuredPostImage = page.locator(
    'data-testid=featured-post-item >> img'
  )

  test
    .expect(featuredPostImage)
    .toHaveAttribute('src', posts[0]?.featuredImage?.node?.mediaItemUrl ?? '')
  test
    .expect(
      page.locator(
        `data-testid=featured-post-item >> text="${posts[0]?.title}"`
      )
    )
    .toBeVisible()

  test
    .expect(page.locator(`data-testid=post-grid-item-${posts[1]?.id}`))
    .toBeVisible()

  if (posts.length > PER_PAGE) {
    test.expect(page.locator('data-testid=posts-pagination')).toBeVisible()
  }
})
