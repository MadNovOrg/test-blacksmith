import { test as base } from '@playwright/test'

import { InviteStatus } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.id = await API.course.insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED,
      false
    )
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('course draft', async ({ page, course }) => {
  const modules = ['Personal Safety']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto(`${course.id}`)
  const courseBuilderPage = await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkNoDraftText()
  await courseBuilderPage.dragModulesToRight(modules)
  await courseBuilderPage.checkDraftTextAppeared()
  await courseBuilderPage.page.goBack()
  await myCoursesPage.searchCourse(`${course.id}`)
  await myCoursesPage.checkCourseStatus(course.id, 'Draft')
  await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkSelectedModulesContain(modules)
})

test('course draft: clear modules', async ({ page, course }) => {
  const modules = ['Personal Safety', 'Neck Disengagement']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto(`${course.id}`)
  const courseBuilderPage = await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.dragModulesToRight(modules)
  await courseBuilderPage.clickClearButton()
  await courseBuilderPage.page.goBack()
  await myCoursesPage.searchCourse(`${course.id}`)
  await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkModulesNotSelected(modules)
})
