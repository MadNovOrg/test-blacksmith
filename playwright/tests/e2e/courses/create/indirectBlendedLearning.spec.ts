import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

const indirectCourseData = {
  name: 'indirect f2f as trainer',
  user: 'trainer',
  course: (() => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.INDIRECT
    course.organization = { name: 'London First School' }
    course.contactProfile = users.userOrgAdmin
    course.freeSpaces = 1
    course.salesRepresentative = users.salesAdmin
    course.go1Integration = true
    course.invoiceDetails = {
      organisation: 'London First School',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@londonschool.co.uk',
      phone: '1939394939',
      purchaseOrder: '12345',
    }
    return course
  })(),
}

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    await use(indirectCourseData.course)
    await API.course.deleteCourse(indirectCourseData.course.id)
  },
})

test(`create blended learning course: ${indirectCourseData.name}`, async ({
  browser,
  course,
}) => {
  const context = await browser.newContext({
    storageState: stateFilePath(indirectCourseData.user),
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
  await coursesListPage.searchCourse(`${course.id}`)
  await coursesListPage.checkCourseStatus(
    course.id,
    'Exceptions approval pending'
  )
})
