/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { getEbooks } from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL, PER_PAGE } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  ebooks: Awaited<ReturnType<typeof getEbooks>>
}>({
  ebooks: async ({}, use) => {
    const ebooks = await getEbooks()

    await use(ebooks)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays ebooks with featured and grid display', async ({
  page,
  ebooks,
}) => {
  await page.goto(`${BASE_URL}/membership/ebooks`)
  await waitForPageLoad(page)

  const featuredEbook = page.locator('[data-testid="featured-ebook"] img')

  test
    .expect(featuredEbook)
    .toHaveAttribute('src', ebooks[0]?.featuredImage?.node?.mediaItemUrl ?? '')
  test
    .expect(
      page.locator(`data-testid=featured-ebook >> text="${ebooks[0]?.title}"`)
    )
    .toBeVisible()

  test
    .expect(page.locator(`data-testid=ebook-grid-item-${ebooks[1]?.id}`))
    .toBeVisible()

  const [donwload] = await Promise.all([
    page.waitForEvent('download'),
    page
      .locator(`data-testid=featured-ebook >> text="Download resource"`)
      .click(),
  ])

  const path = await donwload.path()

  test.expect(path).toBeTruthy() // to be downloaded basically

  // eslint-disable-next-line playwright/no-conditional-in-test
  if (ebooks.length > PER_PAGE) {
    test.expect(page.locator('data-testid=ebooks-pagination')).toBeVisible()
  }
})
