/* eslint-disable no-empty-pattern */
import { test as base, expect } from '@playwright/test'

import { CourseType } from '@app/types'

import { deleteCourse } from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { stateFilePath } from '../../../hooks/global-setup'
import { CourseBuilderPage } from '../../../pages/courses/CourseBuilderPage'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.INDIRECT
    course.organization = { name: 'London First School' }
    await use(course)
    await deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('trainer') })

test('create course: indirect as trainer', async ({ page, course }) => {
  const coursesListPage = new MyCoursesPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.clickCreateCourseButton()
  await createCoursePage.fillCourseDetails(course)
  course.id = await createCoursePage.clickCreateCourseButton()
  const courseBuilderPage = new CourseBuilderPage(page)
  const courseDetailsPage = await courseBuilderPage.clickSubmitButton()
  await courseDetailsPage.header.checkCourseName(course.name)
  expect(page.url()).toContain(course.id.toString())

  await coursesListPage.goto()
  await coursesListPage.coursesTable.checkIsVisible()
  await coursesListPage.checkCourseStatus(course.id, 'Published')
})
