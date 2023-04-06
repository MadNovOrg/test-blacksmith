import { test as base } from '@playwright/test'

import { Course_Source_Enum } from '@app/generated/graphql'
import { CourseDeliveryType, CourseType } from '@app/types'

import * as API from '../../../api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { CourseApprovalRequiredModal } from '../../../pages/courses/CourseApprovalRequiredModal'
import { CourseBuilderPage } from '../../../pages/courses/CourseBuilderPage'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const closedCourseData = {
  name: 'closed virtual as salesAdmin',
  user: 'salesAdmin',
  course: (() => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.CLOSED
    course.source = Course_Source_Enum.EmailEnquiry
    course.organization = { name: 'London First School' }
    course.contactProfile = users.userOrgAdmin
    course.freeSpaces = 1
    course.salesRepresentative = users.salesAdmin
    course.go1Integration = true
    course.deliveryType = CourseDeliveryType.VIRTUAL
    return course
  })(),
}

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    await use(closedCourseData.course)
    await API.course.deleteCourse(closedCourseData.course.id)
  },
})

test(`create blended learning course: ${closedCourseData.name}`, async ({
  browser,
  browserName,
  course,
}) => {
  // Disable in firefox due to datepicker issues
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(browserName === 'firefox')
  const context = await browser.newContext({
    storageState: stateFilePath(closedCourseData.user),
  })
  const page = await context.newPage()

  const coursesListPage = new MyCoursesPage(page)
  const approvalExceptionModal = new CourseApprovalRequiredModal(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.selectCreateCourseOption(course.type)
  await createCoursePage.fillCourseDetails(course)
  const assignTrainersPage = await createCoursePage.clickAssignTrainersButton()
  await assignTrainersPage.selectTrainer(users.trainer)
  const trainerExpensesPage =
    await assignTrainersPage.clickTrainerExpensesButton()
  await approvalExceptionModal.confirmCourseException()

  const reviewAndConfirmPage =
    await trainerExpensesPage.clickReviewAndConfirmButton()

  course.id = await reviewAndConfirmPage.getCourseIdOnCreation()
  // TODO uncomment this assertion after fixing TTHP-1260
  // await coursesListPage.checkCourseStatus(course.id, 'Trainer pending')

  const trainerContext = await browser.newContext({
    storageState: stateFilePath('trainer'),
  })
  const trainerPage = await trainerContext.newPage()
  const trainerCoursesListPage = new MyCoursesPage(trainerPage)
  const courseBuilderPage = new CourseBuilderPage(trainerPage)
  const trainerApprovalExceptionModal = new CourseApprovalRequiredModal(
    trainerPage
  )

  await trainerCoursesListPage.goto()
  await trainerCoursesListPage.searchCourse(`${course.id}`)
  await trainerCoursesListPage.checkCourseWaitingApproval(course.id)
  await trainerCoursesListPage.acceptCourse(course.id)
  await trainerCoursesListPage.goToCourseBuilder()
  await courseBuilderPage.clickSubmitButton()
  await trainerApprovalExceptionModal.confirmCourseException()
  await trainerCoursesListPage.searchCourse(`${course.id}`)
  await trainerCoursesListPage.checkCourseStatus(
    course.id,
    'Exceptions approval pending'
  )
})
