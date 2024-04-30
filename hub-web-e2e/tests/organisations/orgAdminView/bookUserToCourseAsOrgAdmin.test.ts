import { test } from '@playwright/test'

import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/util'

test.use({ storageState: stateFilePath('ttOrgAdmin') })

const teamTeachOrgId = 'a24397aa-b059-46b9-a728-955580823ce4'

test('max 5 courses on org page', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  const courseLocators = await orgPage.maxCourses()
  await test.expect(courseLocators).toBeLessThanOrEqual(5)
})

test('book attendee from organisation page', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  await orgPage.clickBookNow()

  await test.expect(page.getByTestId('booking-form')).toBeVisible()
})

test('book attendee from organisation, all courses page', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  await orgPage.clickSeeAllCourses()
  await orgPage.clickSearchAvailableCourses()
  await orgPage.insertCourseId('10001')
  await orgPage.clickBookNow()

  await test.expect(page.getByTestId('booking-form')).toBeVisible()
})

test('join waiting list from organisation, all courses page', async ({
  page,
}) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  await orgPage.clickSeeAllCourses()
  await orgPage.clickSearchAvailableCourses()
  await orgPage.insertCourseId('10013')
  await orgPage.clickJoinWaitingList()

  await test.expect(page.getByTestId('join-waiting-list-form')).toBeVisible()
})
