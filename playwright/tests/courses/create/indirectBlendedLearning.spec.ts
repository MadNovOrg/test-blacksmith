import { test as base } from '@playwright/test'

import { CourseType } from '@app/types'

import { deleteCourse } from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { CourseApprovalRequiredModal } from '../../../pages/courses/CourseApprovalRequiredModal'
import { CourseBuilderPage } from '../../../pages/courses/CourseBuilderPage'
import { CourseOrderDetailsPage } from '../../../pages/courses/CourseOrderDetailsPage'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

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
    await deleteCourse(indirectCourseData.course.id)
  },
})

test(`create blended learning course: ${indirectCourseData.name}`, async ({
  browser,
  browserName,
  course,
}) => {
  // Disable in firefox due to datepicker issues
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(browserName === 'firefox')
  const context = await browser.newContext({
    storageState: stateFilePath(indirectCourseData.user),
  })
  const page = await context.newPage()

  const coursesListPage = new MyCoursesPage(page)
  const orderDetailsPage = new CourseOrderDetailsPage(page)
  const approvalExceptionModal = new CourseApprovalRequiredModal(page)
  const courseBuilderPage = new CourseBuilderPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.clickCreateCourseButton()
  await createCoursePage.fillCourseDetails(course)
  await createCoursePage.clickOrderDetailsButton()
  // TODO remove it after implementing the exceptions story
  await approvalExceptionModal.confirmCourseException()
  await orderDetailsPage.fillInvoiceDetails(course.invoiceDetails)
  const reviewPage = await orderDetailsPage.clickReviewAndConfirmButton()
  course.id = await reviewPage.getCourseIdAfterProceedingToCourseBuilder()
  await courseBuilderPage.clickSubmitButton()
  await approvalExceptionModal.confirmCourseException()
  await coursesListPage.searchCourse(`${course.id}`)
  await coursesListPage.checkCourseStatus(
    course.id,
    'Exceptions approval pending'
  )
})
