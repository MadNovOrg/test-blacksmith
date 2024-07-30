/* eslint-disable playwright/expect-expect */
import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { UNIQUE_ORGANIZATION } from '@qa/data/organization'
import { users } from '@qa/data/users'
import { AllOrganisations } from '@qa/fixtures/pages/org/AllOrganisations.fixture'
import { stateFilePath } from '@qa/util'

const bookWordpressFormURL =
  'https://share-eu1.hsforms.com/1k2Yr8kkgRJuXF8s6II6npQfdx9c'

let test = base.extend<{ courseId: number }>({
  courseId: async ({}, use) => {
    const course = UNIQUE_COURSE()

    const createCourse = await API.course.insertCourse(
      course,
      users.userOrgAdmin.email,
    )

    const [orgId, profileId] = await Promise.all([
      API.organization.insertOrganization(UNIQUE_ORGANIZATION()),
      API.profile.getProfileId(users.userOrgAdmin.email),
    ])

    const memberId = await API.organization.insertOrganizationMember({
      profile_id: profileId,
      organization_id: orgId,
      isAdmin: true,
    })

    await use(createCourse.id)

    await API.course.deleteCourse(createCourse.id)
    await API.organization.deleteOrganizationMember(memberId)
    await API.organization.deleteOrganization(orgId)
  },
})

test.use({ storageState: stateFilePath('ttOrgAdmin') })

const teamTeachOrgId = 'a24397aa-b059-46b9-a728-955580823ce4'

test('max 5 courses on org page', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  const courseLocators = await orgPage.maxCourses()
  test.expect(courseLocators).toBeLessThanOrEqual(5)
})

test('book attendee from organisation page @smoke', async ({ page }) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  await orgPage.clickBookNow()

  await page.waitForURL(/.*\/(booking\/details|1k2Yr8kkgRJuXF8s6II6npQfdx9c)/i)
})

test('book attendee from organisation, all courses page @smoke', async ({
  page,
  courseId,
}) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  await orgPage.clickSeeAllCourses()
  await orgPage.clickSearchAvailableCourses()
  await orgPage.insertCourseId(courseId.toString())
  await orgPage.clickBookNow()

  await page.waitForURL(/.*\/(booking\/details|1k2Yr8kkgRJuXF8s6II6npQfdx9c)/i)
})

test = base.extend<{ courseId: number }>({
  courseId: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.max_participants = 0

    const createCourse = await API.course.insertCourse(
      course,
      users.userOrgAdmin.email,
    )

    const [orgId, profileId] = await Promise.all([
      API.organization.insertOrganization(UNIQUE_ORGANIZATION()),
      API.profile.getProfileId(users.userOrgAdmin.email),
    ])

    const memberId = await API.organization.insertOrganizationMember({
      profile_id: profileId,
      organization_id: orgId,
      isAdmin: true,
    })

    await use(createCourse.id)

    await API.course.deleteCourse(createCourse.id)
    await API.organization.deleteOrganizationMember(memberId)
    await API.organization.deleteOrganization(orgId)
  },
})

test.use({ storageState: stateFilePath('ttOrgAdmin') })
test('join waiting list from organisation, all courses page', async ({
  page,
  courseId,
}) => {
  const orgPage = new AllOrganisations(page)
  await orgPage.gotoOrganisation(teamTeachOrgId)
  await orgPage.clickSeeAllCourses()
  await orgPage.clickSearchAvailableCourses()
  await orgPage.insertCourseId(courseId.toString())
  await orgPage.clickJoinWaitingList()

  await page.waitForURL(bookWordpressFormURL)
})
