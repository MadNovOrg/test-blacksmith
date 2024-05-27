import { Browser } from '@playwright/test'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'

import { users } from '@qa/data/users'

import { Course } from './data/types'
import { CourseDetailsPage } from './fixtures/pages/courses/course-details/CourseDetailsPage.fixture'
import { MyCoursesPage } from './fixtures/pages/courses/MyCoursesPage.fixture'
import { StoredCredentialKey, stateFilePath } from './util'

export async function closedCourseSteps(
  browser: Browser,
  course: Course,
  user: StoredCredentialKey
) {
  const context = await browser.newContext({
    storageState: stateFilePath(user as StoredCredentialKey),
  })
  const page = await context.newPage()
  const coursesListPage = new MyCoursesPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.selectCreateCourseOption(course.type)
  await createCoursePage.fillCourseDetails(course)
  const assignTrainersPage = await createCoursePage.clickAssignTrainersButton()
  await assignTrainersPage.selectTrainer(users.trainer)
  if (
    course.type === Course_Type_Enum.Closed &&
    [
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
    ].includes(course.level)
  ) {
    await assignTrainersPage.selectModerator(
      users.assistant2,
      course.reaccreditation
    )
  }
  const trainerExpensesPage =
    await assignTrainersPage.clickTrainerExpensesButton()
  const courseOrderDetailsPage =
    await trainerExpensesPage.clickOrderDetailsButton()
  await courseOrderDetailsPage.fillInvoiceDetails(course.invoiceDetails)
  const reviewAndConfirmPage =
    await courseOrderDetailsPage.clickReviewAndConfirmButton()
  course.id = await reviewAndConfirmPage.getCourseIdOnCreation()
  const courseDetailsPage = new CourseDetailsPage(page)
  await courseDetailsPage.goto(course.id.toString())
  await courseDetailsPage.checkClosedCourseCreatedSuccessfully(course)
}

export async function openCourseSteps(
  browser: Browser,
  course: Course,
  user: StoredCredentialKey
) {
  const context = await browser.newContext({
    storageState: stateFilePath(user as StoredCredentialKey),
  })
  const page = await context.newPage()
  const coursesListPage = new MyCoursesPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.selectCreateCourseOption(course.type)
  await createCoursePage.fillCourseDetails(course)
  const assignTrainersPage = await createCoursePage.clickAssignTrainersButton()
  await assignTrainersPage.selectTrainer(users.trainer)
  course.id = await assignTrainersPage.getCourseIdOnCreation()
  const courseDetailsPage = new CourseDetailsPage(page)
  await courseDetailsPage.goto(course.id.toString())
  await courseDetailsPage.checkOpenCourseCreatedSuccessfully(course)
}
