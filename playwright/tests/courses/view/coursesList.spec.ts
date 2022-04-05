/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseLevel } from '../../../../src/types'
import {
  makeSureTrainerHasCourses,
  getTrainerCourses,
} from '../../../api/hasura-api'
import { COURSES_TO_VIEW } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const test = base.extend<{
  coursesToView: Course[]
  courseToSearch: Course
  oneTwoLevelCourses: Course[]
}>({
  coursesToView: async ({}, use) => {
    await makeSureTrainerHasCourses(COURSES_TO_VIEW, users.trainerWithOrg)
    const courses = await getTrainerCourses(users.trainerWithOrg)
    await use(courses)
  },
  courseToSearch: async ({}, use) => {
    const course = COURSES_TO_VIEW[0]
    await makeSureTrainerHasCourses([course], users.trainerWithOrg)
    const courses = await getTrainerCourses(users.trainerWithOrg)
    await use(courses.find(c => c.name === course.name))
  },
  oneTwoLevelCourses: async ({}, use) => {
    await makeSureTrainerHasCourses(COURSES_TO_VIEW, users.trainerWithOrg)
    const courses = await getTrainerCourses(users.trainerWithOrg)
    await use(
      courses.filter(
        c => c.level == CourseLevel.LEVEL_1 || c.level == CourseLevel.LEVEL_2
      )
    )
  },
})
test.use({ storageState: stateFilePath('trainerWithOrg') })

test('my courses view @smoke', async ({ page, coursesToView }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.checkRows(coursesToView)
})

test('my courses search', async ({ page, courseToSearch }) => {
  const searchString = courseToSearch.name.slice(1)
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(searchString)
  await myCoursesPage.checkRows([courseToSearch])
})

test('my courses filter', async ({ page, oneTwoLevelCourses }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.filterCourses('Level', ['Level One', 'Level Two'])
  await myCoursesPage.checkRows(oneTwoLevelCourses)
})
