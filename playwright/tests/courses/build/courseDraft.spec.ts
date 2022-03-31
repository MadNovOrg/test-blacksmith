/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
import { Course } from '../../../data/types'
import { UNIQUE_COURSE } from '../../../data/courses'
import { insertCourse, deleteCourse } from '../../../api/hasura-api'
import { users } from '../../../data/users'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    await insertCourse(course, users.trainerWithOrg)
    await use(course)
    await deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('trainerWithOrg') })

test('course draft', async ({ page, course }) => {
  const modules = ['Personal Safety']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  const courseBuilderPage = await myCoursesPage.clickCourseName(course.name)
  await courseBuilderPage.checkNoDraftText()
  await courseBuilderPage.dragModulesToRight(modules)
  await courseBuilderPage.checkDraftTextAppeared()
  await page.goBack()
  await myCoursesPage.checkCourseStatus(course.name, 'Draft')
  await myCoursesPage.clickCourseName(course.name)
  await courseBuilderPage.checkSelectedModulesContain(modules)
})

test('course draft: clear modules', async ({ page, course }) => {
  const modules = ['Personal Safety', 'Neck Disengagement']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  const courseBuilderPage = await myCoursesPage.clickCourseName(course.name)
  await courseBuilderPage.dragModulesToRight(modules)
  await courseBuilderPage.clickClearButton()
  await page.goBack()
  await myCoursesPage.checkCourseStatus(course.name, 'Draft')
  await myCoursesPage.clickCourseName(course.name)
  await courseBuilderPage.checkModulesNotSelected(modules)
})
