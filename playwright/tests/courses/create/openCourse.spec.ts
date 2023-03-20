/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseDeliveryType } from '@app/types'

import { deleteCourse } from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { LoginPage } from '../../../pages/auth/LoginPage'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const dataSet = [
  {
    name: 'open f2f as admin',
    user: 'admin',
    course: (() => {
      const course = UNIQUE_COURSE()
      return course
    })(),
  },
  {
    name: 'open virtual as ops',
    user: 'ops',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.VIRTUAL
      course.schedule[0].virtualLink = 'www.zoom.com/testlink'
      return course
    })(),
  },
]

for (const data of dataSet) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      await use(data.course)
      await deleteCourse(data.course.id)
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
    await assignTrainersPage.selectTrainer(users.trainer2)
    course.id =
      await assignTrainersPage.getOrderIdAfterClickingCreateCourseButton()

    const otherPage = await browser.newPage()
    const loginPage = new LoginPage(otherPage)
    const coursesListPage2 = new MyCoursesPage(otherPage)
    await loginPage.goto()
    await loginPage.logIn(users.trainer2.email, users.trainer2.password)
    await coursesListPage2.userMenu.checkIsVisible()
    await coursesListPage2.roleSwitcher.selectRole('Trainer')
    await coursesListPage2.coursesTable.checkIsVisible()
    await coursesListPage2.searchCourse(course.id.toString())
    await coursesListPage2.checkCourseWaitingApproval(course.id)
  })
}
