import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { TEST_SETTINGS } from '@qa/constants'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { ProfilePage } from '@qa/pages/profile/ProfilePage'

const createCourses = async (): Promise<Course[]> => {
  const courses: Course[] = []
  for (let i = 0; i < 2; i++) {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.id = await API.course.insertCourse(course, users.trainer.email)
    courses.push(course)
  }
  return courses
}

const test = base.extend<{ courses: Course[] }>({
  courses: async ({}, use) => {
    const courses = await createCourses()
    await API.course.insertCourseParticipants(courses[0].id, [users.user1])
    await API.course.transferToCourse(
      courses[0].id,
      courses[1].id,
      users.user1.email
    )
    await use(courses)
    for (const course of courses) {
      await API.course.deleteCourse(course.id)
    }
  },
})

test.use({ storageState: stateFilePath('admin') })

test.beforeEach(async ({}) => {
  TEST_SETTINGS.role = 'tt-admin'
})

test.afterEach(async ({}) => {
  TEST_SETTINGS.role = ''
})

test('admin can see the course history of a user', async ({
  page,
  courses,
}) => {
  const profileId = await API.profile.getProfileId(users.user1.email)
  const profilePage = new ProfilePage(page)
  await profilePage.goto(profileId)
  await profilePage.checkCourseHistory(courses[0].id, 'Transferred')
})
