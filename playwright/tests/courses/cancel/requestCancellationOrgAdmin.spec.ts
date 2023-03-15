/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus, CourseType } from '@app/types'

import {
  getModuleIds,
  insertCourse,
  insertCourseModulesPromise,
  deleteCourse,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { getModulesByLevel } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
import { inXMonths } from '../../../util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.organization = { name: 'London First School' }
    course.schedule[0].start = inXMonths(2)
    course.schedule[0].end = inXMonths(2)
    course.status = Course_Status_Enum.Scheduled
    const moduleIds = await getModuleIds(
      getModulesByLevel(course.level),
      course.level
    )
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await insertCourseModulesPromise(course.id, moduleIds)
    await use(course)
    await deleteCourse(course.id)
  },
})

test('request cancelling a course as org admin', async ({
  browser,
  course,
}) => {
  const orgAdminContext = await browser.newContext({
    storageState: stateFilePath('userOrgAdmin'),
  })
  const page = await orgAdminContext.newPage()
  const orgAdminCoursesPage = new MyCoursesPage(page)
  await orgAdminCoursesPage.goto()
  await orgAdminCoursesPage.searchCourse(`${course.id}`)
  const courseDetailsPage = await orgAdminCoursesPage.clickCourseDetailsPage(
    course.id
  )
  const requestCancellationPopUp =
    await courseDetailsPage.clickRequestCancellation()
  await requestCancellationPopUp.addReasonForCancellation('reason')
  await requestCancellationPopUp.checkConfirmCheckbox()
  await requestCancellationPopUp.clickConfirmButton()
  await courseDetailsPage.cancellationRequestIsVisible()

  //log in as admin to approve the cancellation
  const adminContext = await browser.newContext({
    storageState: stateFilePath('admin'),
  })
  const adminPage = await adminContext.newPage()
  const adminCoursesPage = new MyCoursesPage(adminPage)
  await adminCoursesPage.goto()
  await adminCoursesPage.searchCourse(`${course.id}`)
  await adminCoursesPage.clickCourseDetailsPage(course.id)
  const cancelEntireCoursePopUp = await courseDetailsPage.approveCancellation()
  await cancelEntireCoursePopUp.checkFeeRadioButton()
  await cancelEntireCoursePopUp.clickCancelEntireCourseButton()
  await adminCoursesPage.goto()
  await adminCoursesPage.searchCourse(`${course.id}`)
  await adminCoursesPage.checkCourseStatus(course.id, 'Cancelled')
})
