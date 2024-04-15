import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { TEST_SETTINGS } from '@qa/constants'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { ProfilePage } from '@qa/fixtures/pages/profile/ProfilePage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ courses: Course[] }>({
  courses: async ({}, use) => {
    const courses: Course[] = []
    for (let i = 0; i < 2; i++) {
      const course = UNIQUE_COURSE()
      course.organization = { name: 'London First School' }
      course.id = await API.course.insertCourse(course, users.trainer.email)
      courses.push(course)
    }
    await API.course.insertCourseParticipants(courses[0].id, [users.user1])
    await API.course.transferToCourse(
      courses[0].id,
      courses[1].id,
      users.user1.email,
      'Reason'
    )
    await use(courses)
    for (const course of courses) {
      await API.course.deleteCourse(course.id)
    }
  },
})

test.beforeEach(async ({}) => {
  TEST_SETTINGS.role = 'tt-admin'
})

test.afterEach(async ({}) => {
  TEST_SETTINGS.role = undefined
})

test.use({ storageState: stateFilePath('admin') })

test('admin can see the course history of a user', async ({
  page,
  courses,
}) => {
  test.fixme(process.env.E2E === 'true')
  const profileId = await API.profile.getProfileId(users.user1.email)
  const profilePage = new ProfilePage(page)
  await profilePage.goto(profileId)
  await profilePage.checkCourseHistory(courses[0].id, 'Transferred')
})
