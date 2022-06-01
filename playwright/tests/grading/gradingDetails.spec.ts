/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'
import { subDays } from 'date-fns'

import { CourseModule, CourseParticipant } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
  insertCourseParticipants,
} from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { UNIQUE_COURSE } from '../../data/courses'
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
    const course = UNIQUE_COURSE()
    course.schedule[0].start = subDays(new Date(), 2)
    course.schedule[0].end = subDays(new Date(), 1)

    course.id = await insertCourse(course, users.trainer.email)

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

    const modules = await insertCourseModules(course.id, moduleIds)

    await use(modules)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('marks participants as attended and enables grading', async ({
  page,
  course,
  participants,
  modules,
}) => {
  await page.goto(`${BASE_URL}/courses/${course.id}/grading-details`)
  await page.locator(`text="${participants[0].profile.fullName}"`).click()

  test
    .expect(page.locator(`text=${participants.length - 1} selected`))
    .toBeVisible()

  await page.locator('text=Next: Confirm modules and techniques').click()
  await page.locator(`text="${modules[0].module.moduleGroup.name}"`).click()
  await page.locator('text=Continue to grading attendees').click()

  await page.waitForNavigation()

  test
    .expect(page.url())
    .toEqual(`${BASE_URL}/courses/${course.id}/details?tab=GRADING`)
})
