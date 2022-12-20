/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { InviteStatus } from '@app/types'

import { insertCourse, deleteCourse } from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await use(course)
    await deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('trainer') })

test('course draft', async ({ page, course }) => {
  const modules = ['Personal Safety']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(`${course.id}`)
  const courseBuilderPage = await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkNoDraftText()
  await courseBuilderPage.dragModulesToRight(modules)
  await courseBuilderPage.checkDraftTextAppeared()
  await page.goBack()
  await myCoursesPage.searchCourse(`${course.id}`)
  await myCoursesPage.checkCourseStatus(course.id, 'Draft')
  await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkSelectedModulesContain(modules)
})

test('course draft: clear modules', async ({ page, course }) => {
  const modules = ['Personal Safety', 'Neck Disengagement']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto()
  await myCoursesPage.searchCourse(`${course.id}`)
  const courseBuilderPage = await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.dragModulesToRight(modules)
  await courseBuilderPage.clickClearButton()
  await page.goBack()
  await myCoursesPage.searchCourse(`${course.id}`)
  await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkModulesNotSelected(modules)
})
