import { test as base } from '@playwright/test'

import { CourseDeliveryType, CourseType } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { CourseApprovalRequiredModal } from '@qa/pages/courses/CourseApprovalRequiredModal'
import { CourseBuilderPage } from '@qa/pages/courses/CourseBuilderPage'
import { MyCoursesPage } from '@qa/pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.organization = { name: 'London First School' }
    course.bookingContactProfile = users.userOrgAdmin
    course.freeSpaces = 1
    course.salesRepresentative = users.salesAdmin
    course.go1Integration = true
    course.deliveryType = CourseDeliveryType.VIRTUAL
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test(`create blended learning course: closed virtual as salesAdmin`, async ({
  browser,
  course,
}) => {
  const context = await browser.newContext({
    storageState: stateFilePath('salesAdmin'),
  })
  const page = await context.newPage()

  const coursesListPage = new MyCoursesPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.selectCreateCourseOption(course.type)
  await createCoursePage.fillCourseDetails(course)
  const assignTrainersPage = await createCoursePage.clickAssignTrainersButton()
  await assignTrainersPage.selectTrainer(users.trainer)
  await assignTrainersPage.selectAssistantTrainer(users.trainer2)
  const trainerExpensesPage =
    await assignTrainersPage.clickTrainerExpensesButton()
  const courseOrderDetailsPage =
    await trainerExpensesPage.clickReviewAndConfirmButton()
  await courseOrderDetailsPage.fillInvoiceDetails(course.invoiceDetails)
  const reviewAndConfirmPage =
    await courseOrderDetailsPage.clickReviewAndConfirmButton()
  course.id = await reviewAndConfirmPage.getCourseIdOnCreation()

  const trainerContext = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })
  const trainerPage = await trainerContext.newPage()
  const trainerCoursesListPage = new MyCoursesPage(trainerPage)
  const courseBuilderPage = new CourseBuilderPage(trainerPage)
  const trainerApprovalExceptionModal = new CourseApprovalRequiredModal(
    trainerPage
  )
  await trainerCoursesListPage.goto(`${course.id}`)
  await trainerCoursesListPage.checkCourseWaitingApproval(course.id)
  await trainerCoursesListPage.acceptCourse(course.id)
  await trainerCoursesListPage.goToCourseBuilder()
  await courseBuilderPage.clickSubmitButton()
  await trainerApprovalExceptionModal.confirmCourseException()
  await trainerCoursesListPage.goto(`${course.id}`)
  await trainerCoursesListPage.checkCourseStatus(course.id, 'Trainer pending')
})
