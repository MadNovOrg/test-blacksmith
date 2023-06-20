import { test as base } from '@playwright/test'

import { CourseDeliveryType, CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

const dataSet = [
  {
    name: 'closed f2f as admin',
    user: 'admin',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.bookingContactProfile = users.userOrgAdmin
      course.freeSpaces = 1
      course.salesRepresentative = users.salesAdmin
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
  },
  {
    name: 'closed mixed as ops',
    user: 'ops',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.bookingContactProfile = users.userOrgAdmin
      course.reaccreditation = true
      course.freeSpaces = 1
      course.deliveryType = CourseDeliveryType.MIXED
      course.salesRepresentative = users.salesAdmin
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
  },
]

for (const data of dataSet) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      await use(data.course)
      await API.course.deleteCourse(data.course.id)
    },
  })

  test(`create course: ${data.name}`, async ({ browser, course }) => {
    const context = await browser.newContext({
      storageState: stateFilePath(data.user),
    })
    const page = await context.newPage()
    const coursesListPage = new MyCoursesPage(page)
    await coursesListPage.goto()
    const createCoursePage =
      await coursesListPage.createCourseMenu.selectCreateCourseOption(
        course.type
      )
    await createCoursePage.fillCourseDetails(course)
    const assignTrainersPage =
      await createCoursePage.clickAssignTrainersButton()
    await assignTrainersPage.selectTrainer(users.trainer)
    const trainerExpensesPage =
      await assignTrainersPage.clickTrainerExpensesButton()
    const courseOrderDetailsPage =
      await trainerExpensesPage.clickReviewAndConfirmButton()
    await courseOrderDetailsPage.fillInvoiceDetails(course.invoiceDetails)
    const reviewAndConfirmPage =
      await courseOrderDetailsPage.clickReviewAndConfirmButton()
    course.id = await reviewAndConfirmPage.getCourseIdOnCreation()
    await reviewAndConfirmPage.confirmApproval()

    const trainerContext = await browser.newContext({
      storageState: stateFilePath('trainer'),
    })
    const otherPage = await trainerContext.newPage()
    const trainerCoursesListPage = new MyCoursesPage(otherPage)
    await trainerCoursesListPage.goto()
    await trainerCoursesListPage.searchCourse(`${course.id}`)
    await trainerCoursesListPage.checkCourseWaitingApproval(course.id)
  })
}
