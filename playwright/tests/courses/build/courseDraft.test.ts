import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.ConfirmModules
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
  test.fixme(true, 'See https://behaviourhub.atlassian.net/browse/TTHP-1756')
  const modules = ['Personal Safety']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto(`${course.id}`)
  const courseBuilderPage = await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkNoDraftText()
  await courseBuilderPage.selectModule(modules)
  await courseBuilderPage.checkDraftTextAppeared()
  await courseBuilderPage.page.goBack()
  await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkSelectedModulesContain(modules)
})

test('course draft: clear modules', async ({ page, course }) => {
  const modules = ['Personal Safety', 'Neck Disengagement']
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.goto(`${course.id}`)
  const courseBuilderPage = await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.selectModule(modules)
  await courseBuilderPage.clickClearButton()
  await courseBuilderPage.page.goBack()
  await myCoursesPage.searchCourse(`${course.id}`)
  await myCoursesPage.clickCourse(course.id)
  await courseBuilderPage.checkModulesNotSelected(modules)
})
