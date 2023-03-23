import { test as base } from '@playwright/test'

import { PostSummaryFragment } from '@app/generated/graphql'

import { getBlogPosts } from '../../api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { BlogPage } from '../../pages/membership/BlogPage'

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
  test.fail(
    true,
    'Currently failing as there are no default images for blog posts, see https://behaviourhub.atlassian.net/browse/TTHP-1261'
  )
  const blogPage = new BlogPage(page)
  await blogPage.goto()
  await blogPage.checkFeaturedImage(
    posts[0]?.featuredImage?.node?.mediaItemUrl ?? ''
  )
  await blogPage.checkFeaturedTitle(posts[0]?.title ?? '')
  await blogPage.checkGridItem(posts[1]?.id ?? '')
  await blogPage.checkPagination(posts.length)
})
