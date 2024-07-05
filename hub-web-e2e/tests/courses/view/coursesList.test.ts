import { test as base } from '@playwright/test'

import { Course_Level_Enum } from '@app/generated/graphql'

import * as API from '@qa/api'
import { COURSES_TO_VIEW } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const deleteCourses = async (courses: Course[]) => {
  const deletePromises = courses.map(course =>
    API.course.deleteCourse(course.id),
  )
  await Promise.all(deletePromises)
}

const test = base.extend<{
  courses: Course[]
}>({
  courses: async ({}, use) => {
    const courses = await API.course.makeSureTrainerHasCourses(
      COURSES_TO_VIEW,
      users.trainerWithOrg.email,
    )
    await use(courses)
    await deleteCourses(courses)
  },
})

test.use({ storageState: stateFilePath('trainerWithOrg') })

// eslint-disable-next-line playwright/no-skipped-test
test.skip('my courses view @smoke', async ({ page, courses }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.checkRows(courses)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
test('my courses filter', async ({ page, courses }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.filterCourses('FilterByCourseLevel', [
    Course_Level_Enum.Level_1,
    Course_Level_Enum.Level_2,
  ])
  await myCoursesPage.checkCourseLevelInRows([
    Course_Level_Enum.Level_1,
    Course_Level_Enum.Level_2,
  ])
})
