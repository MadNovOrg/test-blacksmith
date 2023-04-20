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
  coursesToView: Course[]
  oneTwoLevelCourses: Course[]
}>({
  coursesToView: async ({}, use) => {
    const courses = await API.course.makeSureTrainerHasCourses(
      COURSES_TO_VIEW,
      users.trainerWithOrg.email
    )
    await use(courses)
    await deleteCourses(courses)
  },

  oneTwoLevelCourses: async ({}, use) => {
    const courses = await API.course.makeSureTrainerHasCourses(
      COURSES_TO_VIEW,
      users.trainerWithOrg.email
    )
    const filterCourses = courses.filter(
      course =>
        course.level == CourseLevel.Level_1 ||
        course.level == CourseLevel.Level_2
    )
    await use(filterCourses)
    await deleteCourses(courses)
  },
})

test.use({ storageState: stateFilePath('trainerWithOrg') })

test('my courses view @smoke', async ({ page, coursesToView }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.checkRows(coursesToView)
})

test('my courses filter', async ({ page, oneTwoLevelCourses }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.filterCourses('FilterCourseLevel', [
    CourseLevel.Level_1,
    CourseLevel.Level_2,
  ])
  await myCoursesPage.checkRows(oneTwoLevelCourses)
})
