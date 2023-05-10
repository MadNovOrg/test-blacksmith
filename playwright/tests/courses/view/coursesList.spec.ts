import { test as base } from '@playwright/test'

import { CourseLevel } from '@app/types'

import * as API from '../../../api'
import { COURSES_TO_VIEW } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const deleteCourses = async (courses: Course[]) => {
  const deletePromises = courses.map(course =>
    API.course.deleteCourse(course.id)
  )
  await Promise.all(deletePromises)
}

const test = base.extend<{
  courses: Course[]
}>({
  courses: async ({}, use) => {
    const courses = await API.course.makeSureTrainerHasCourses(
      COURSES_TO_VIEW,
      users.trainerWithOrg.email
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
  await myCoursesPage.filterCourses('FilterCourseLevel', [
    CourseLevel.Level_1,
    CourseLevel.Level_2,
  ])
  await myCoursesPage.checkCourseLevelInRows([
    CourseLevel.Level_1,
    CourseLevel.Level_2,
  ])
})
