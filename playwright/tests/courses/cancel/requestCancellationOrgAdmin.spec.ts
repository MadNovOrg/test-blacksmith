import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.organization = { name: 'London First School' }
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await use(course)
    await API.course.deleteCourse(course.id)
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
  await orgAdminCoursesPage.gotoManageCourses(`${course.id}`)
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
  await adminCoursesPage.goto(`${course.id}`)
  const adminCourseDetailsPage = await adminCoursesPage.clickCourseDetailsPage(
    course.id
  )
  const cancelEntireCoursePopUp =
    await adminCourseDetailsPage.approveCancellation()
  await cancelEntireCoursePopUp.checkFeeRadioButton()
  await cancelEntireCoursePopUp.clickCancelEntireCourseButton()
  await adminCoursesPage.goto(`${course.id}`)
  await adminCoursesPage.checkCourseStatus(course.id, 'Cancelled')
})
