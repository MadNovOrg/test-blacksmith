/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { PostSummaryFragment } from '@app/generated/graphql'

import { getBlogPosts } from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
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
  await waitForPageLoad(page)

  const featuredPostImage = page.locator(
    'data-testid=featured-post-item >> img'
  )

  await test
    .expect(featuredPostImage)
    .toHaveAttribute('src', posts[0]?.featuredImage?.node?.mediaItemUrl ?? '')
  await test
    .expect(
      page.locator(
        `data-testid=featured-post-item >> text="${posts[0]?.title}"`
      )
    )
    .toBeVisible()

  await test
    .expect(page.locator(`data-testid=post-grid-item-${posts[1]?.id}`))
    .toBeVisible()

  // eslint-disable-next-line playwright/no-conditional-in-test
  if (posts.length > PER_PAGE) {
    await test
      .expect(page.locator('data-testid=posts-pagination'))
      .toBeVisible()
  }
})
