/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseLevel } from '@app/types'

import {
  getTrainerCourses,
  makeSureTrainerHasCourses,
} from '../../../api/hasura-api'
import { COURSES_TO_VIEW } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const test = base.extend<{
  coursesToView: Course[]
  courseSearchText: string
  searchResults: Course[]
  oneTwoLevelCourses: Course[]
}>({
  coursesToView: async ({}, use) => {
    await makeSureTrainerHasCourses(COURSES_TO_VIEW, users.trainerWithOrg.email)
    const courses = await getTrainerCourses(users.trainerWithOrg.email)
    await use(courses)
  },
  courseSearchText: async ({}, use) => {
    await use(COURSES_TO_VIEW[0].name.slice(1).toLocaleLowerCase())
  },
  searchResults: async ({ courseSearchText }, use) => {
    await makeSureTrainerHasCourses(COURSES_TO_VIEW, users.trainerWithOrg.email)
    const courses = await getTrainerCourses(users.trainerWithOrg.email)
    await use(
      courses.filter(c => c.name.toLocaleLowerCase().includes(courseSearchText))
    )
  },
  oneTwoLevelCourses: async ({}, use) => {
    await makeSureTrainerHasCourses(COURSES_TO_VIEW, users.trainerWithOrg.email)
    const courses = await getTrainerCourses(users.trainerWithOrg.email)
    await use(
      courses.filter(
        c => c.level == CourseLevel.Level_1 || c.level == CourseLevel.Level_2
      )
    )
  },
})
test.use({ storageState: stateFilePath('trainerWithOrg') })

test.skip('my courses view @smoke', async ({ page, coursesToView }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.checkRows(coursesToView)
})

test.skip('my courses search', async ({
  page,
  courseSearchText,
  searchResults,
}) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(courseSearchText)
  await myCoursesPage.checkRows(searchResults)
})

test.skip('my courses filter', async ({ page, oneTwoLevelCourses }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.filterCourses('FilterCourseLevel', [
    'Level One',
    'Level Two',
  ])
  await myCoursesPage.checkRows(oneTwoLevelCourses)
})
