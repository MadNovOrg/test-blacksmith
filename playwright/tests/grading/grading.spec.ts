/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { CourseModule, CourseParticipant, InviteStatus } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
  insertCourseParticipants,
} from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { FINISHED_COURSE } from '../../data/courses'
import { getModulesByLevel } from '../../data/modules'
import { Course } from '../../data/types'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  course: Course
  participants: CourseParticipant[]
  modules: CourseModule[]
}>({
  course: async ({}, use) => {
    const course = FINISHED_COURSE()
    course.gradingConfirmed = true
    course.status = Course_Status_Enum.GradeMissing

    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )

    await use(course)
    await deleteCourse(course.id)
  },
  participants: async ({ course }, use) => {
    const participants = await insertCourseParticipants(
      course.id,
      [users.user1WithOrg, users.user2WithOrg],
      new Date('2022-03-14T00:00:00Z')
    )

    await use(participants)
  },
  modules: async ({ course }, use) => {
    const moduleIds = await getModuleIds(
      getModulesByLevel(course.level),
      course.level
    )

    const modules = await insertCourseModules(course.id, moduleIds, true)

    await use(modules)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('trainer can grade all participants', async ({
  page,
  course,
  participants,
  modules,
}) => {
  await page.goto(`${BASE_URL}/courses/${course.id}/details`)
  await waitForPageLoad(page)

  await page.click('data-testid=grading-tab')
  await page.click('text=Grade all attendees')

  for (const participant of participants) {
    await test
      .expect(page.locator(`text=${participant.profile.fullName}`))
      .toBeVisible()
  }

  await page.click('data-testid=course-grading-menu-selected')
  await page.click('[role=listbox] >> text=Pass')
  await page.click(`text=${modules[0].module.moduleGroup.name}`)
  await page.fill('data-testid=feedback-input >> input', 'Feedback')
  await page.click('text=Submit final grade')
  await page.click('button:has-text("Confirm")')

  await page.waitForNavigation()

  // swr is not refetching in the E2E env, need to reload the page to see results
  await page.reload({ waitUntil: 'networkidle' })

  for (const participant of participants) {
    await test
      .expect(
        page.locator(
          `data-testid=attending-participant-row-${participant.id} >> text=Pass`
        )
      )
      .toBeVisible()
  }
})

test('trainer can grade single participant', async ({
  page,
  course,
  participants,
  modules,
}) => {
  await page.goto(`${BASE_URL}/courses/${course.id}/details`)
  await page.waitForLoadState('domcontentloaded')
  await test.expect(page.locator('role=progressbar')).toHaveCount(0)
  await test.expect(page.locator('.MuiSkeleton-pulse')).toHaveCount(0)

  await page.click('data-testid=grading-tab')
  await page.click(
    `data-testid=attending-participant-row-${participants[0].id} >> button:has-text("Grade")`
  )

  await test
    .expect(page.locator(`text=${participants[0].profile.fullName}`))
    .toBeVisible()
  await test
    .expect(page.locator(`text=${participants[1].profile.fullName}`))
    .not.toBeVisible()

  await page.click('data-testid=course-grading-menu-selected')
  await page.click('[role=listbox] >> text=Pass')
  await page.click(`text=${modules[0].module.moduleGroup.name}`)
  await page.fill('data-testid=feedback-input >> input', 'Feedback')
  await page.click('text=Submit final grade')
  await page.click('button:has-text("Confirm")')

  await page.waitForNavigation()

  // swr is not refetching in the E2E env, need to reload the page to see results
  await page.reload({ waitUntil: 'networkidle' })

  await test
    .expect(
      page.locator(
        `data-testid=attending-participant-row-${participants[0].id} >> text=Pass`
      )
    )
    .toBeVisible()

  await test
    .expect(
      page.locator(
        `data-testid=attending-participant-row-${participants[1].id} >> button:has-text("Grade")`
      )
    )
    .toBeVisible()
})
