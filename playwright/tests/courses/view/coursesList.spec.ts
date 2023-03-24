import { test as base } from '@playwright/test'

import { CourseLevel } from '@app/types'

import {
  deleteCourse,
  makeSureTrainerHasCourses,
} from '../../../api/hasura-api'
import { COURSES_TO_VIEW } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const deleteCourses = async (courses: Course[]) => {
  const deletePromises = courses.map(course => deleteCourse(course.id))
  await Promise.all(deletePromises)
}

const test = base.extend<{
  coursesToView: Course[]
  courseSearchText: string
  searchResults: Course[]
  oneTwoLevelCourses: Course[]
}>({
  coursesToView: async ({}, use) => {
    const courses = await makeSureTrainerHasCourses(
      COURSES_TO_VIEW,
      users.trainerWithOrg.email
    )
    console.log(`courses.length: ${courses.length}`)
    await use(COURSES_TO_VIEW)
    await deleteCourses(COURSES_TO_VIEW)
  },
  courseSearchText: async ({}, use) => {
    await use(COURSES_TO_VIEW[0].name.slice(1).toLocaleLowerCase())
  },
  searchResults: async ({ courseSearchText }, use) => {
    const courses = await makeSureTrainerHasCourses(
      COURSES_TO_VIEW,
      users.trainerWithOrg.email
    )
    const filterCourses = courses.filter(course =>
      course.name.toLocaleLowerCase().includes(courseSearchText)
    )
    await use(filterCourses)
    await deleteCourses(courses)
  },
  oneTwoLevelCourses: async ({}, use) => {
    const courses = await makeSureTrainerHasCourses(
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

test('my courses search', async ({ page, courseSearchText, searchResults }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(courseSearchText)
  await myCoursesPage.checkRows(searchResults)
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
