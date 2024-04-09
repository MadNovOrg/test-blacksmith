import { test as base } from '@playwright/test'

import { InviteStatus } from '@app/types'

import * as API from '@qa/api'
import { MODULES_SETUP } from '@qa/data/modules'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

for (const data of MODULES_SETUP) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      data.course.id = await API.course.insertCourse(
        data.course,
        users.trainer.email,
        InviteStatus.ACCEPTED,
        false
      )
      await use(data.course)
      await API.course.deleteCourse(data.course.id)
    },
  })
  test.use({ storageState: stateFilePath('trainer') })

  test(`build course: ${data.name}`, async ({ page, course }) => {
    test.skip()
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto(`${course.id}`)
    const courseBuilderPage = await myCoursesPage.clickCourse(course.id)
    await courseBuilderPage.checkMandatoryModules(data.mandatoryModules)
    await courseBuilderPage.checkAvailableModules([
      ...data.mandatoryModules,
      ...data.optionalModules,
    ])

    if (data.durationBefore) {
      await courseBuilderPage.checkEstimatedDuration(data.durationBefore)
    }

    await courseBuilderPage.selectModule(data.modulesToMove)

    if (data.durationAfter) {
      await courseBuilderPage.checkEstimatedDuration(data.durationAfter)
    }

    const courseDetailsPage =
      await courseBuilderPage.clickConfirmWarningSubmitButton()
    await courseDetailsPage.checkSuccessMessage(
      `You have successfully created your ${course.id} Course`
    )
  })
}
