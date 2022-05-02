/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { InviteStatus } from '@app/types'

import { insertCourse, deleteCourse } from '../../../api/hasura-api'
import { MODULES_SETUP } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

for (const data of MODULES_SETUP) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      data.course.id = await insertCourse(
        data.course,
        users.trainer.email,
        InviteStatus.ACCEPTED
      )
      await use(data.course)
      await deleteCourse(data.course.id)
    },
  })
  test.use({ storageState: stateFilePath('trainer') })

  test(`build course: ${data.name}`, async ({ page, course }) => {
    test.skip(
      !data.name.includes('advanced'),
      'Level 1 & 2 are skipped until TTHP-82 is done'
    )
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.goto()
    const courseBuilderPage = await myCoursesPage.clickCourseBuildButton(
      course.id
    )
    await courseBuilderPage.checkMandatoryModules(data.mandatoryModules)
    await courseBuilderPage.checkAvailableModules(data.optionalModules)
    await courseBuilderPage.checkEstimatedDuration(data.durationBefore)
    await courseBuilderPage.dragModulesToRight(data.modulesToMove)
    await courseBuilderPage.checkEstimatedDuration(data.durationAfter)
    const courseDetailsPage = await courseBuilderPage.clickSubmitButton()
    await courseDetailsPage.checkSuccessMessage(
      `You have successfully created your ${course.name} Course`
    )
  })
}
