import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.INDIRECT
    course.organization = { name: 'London First School' }
    course.bookingContactProfile = users.userOrgAdmin
    course.freeSpaces = 1
    course.salesRepresentative = users.salesAdmin
    course.go1Integration = true
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test(`create blended learning course: indirect f2f as trainer`, async ({
  browser,
  course,
}) => {
  const context = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })
  const page = await context.newPage()
  const coursesListPage = new MyCoursesPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.clickCreateCourseButton()
  await createCoursePage.fillCourseDetails(course)
  const orderDetailsPage = await createCoursePage.clickOrderDetailsButton()
  await orderDetailsPage.fillInvoiceDetails(course.invoiceDetails)
  const reviewPage = await orderDetailsPage.clickReviewAndConfirmButton()
  const courseBuilder =
    await reviewPage.getCourseIdAfterProceedingToCourseBuilder()
  const courseBuilderPage = courseBuilder.courseBuilderPage
  course.id = courseBuilder.id
  await courseBuilderPage.clickSubmitButton()
  await coursesListPage.goto()
  await coursesListPage.searchCourse(`${course.id}`)
  await coursesListPage.checkCourseStatus(
    course.id,
    'Exceptions approval pending'
  )
})
