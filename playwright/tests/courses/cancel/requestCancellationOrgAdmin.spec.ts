import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus, CourseType } from '@app/types'

import { insertCourse, deleteCourse } from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
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
  await orgAdminCoursesPage.gotoManageCourses()
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
