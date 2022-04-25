/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { CourseDeliveryType, CourseType } from '@app/types'

import { deleteCourse } from '../../../api/hasura-api'
import { Option } from '../../../components/UserMenu'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { LoginPage } from '../../../pages/auth/LoginPage'
import { CourseBuilderPage } from '../../../pages/courses/CourseBuilderPage'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const dataSet = [
  {
    name: 'open f2f as admin',
    user: 'admin',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.organization = null
      return course
    })(),
  },
  {
    name: 'closed f2f as admin',
    user: 'admin',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.contactProfile = users.orgAdmin
      return course
    })(),
  },
  {
    name: 'open virtual as ops',
    user: 'ops',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.organization = null
      course.deliveryType = CourseDeliveryType.VIRTUAL
      return course
    })(),
  },
  {
    name: 'closed mixed as ops',
    user: 'ops',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.contactProfile = users.orgAdmin
      course.reaccreditation = true
      course.deliveryType = CourseDeliveryType.MIXED
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
  test.use({ storageState: stateFilePath(data.user) })

  test(`create course: ${data.name}`, async ({ page, course }) => {
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
    course.id = await assignTrainersPage.clickCreateCourseButton()

    await coursesListPage.userMenu.selectOption(Option.Logout)
    const loginPage = new LoginPage(page)
    await loginPage.logIn(users.trainer2.email, users.trainer2.password)
    await coursesListPage.userMenu.checkIsVisible()
    await coursesListPage.roleSwitcher.selectRole('Trainer')
    await coursesListPage.coursesTable.checkIsVisible()
    await coursesListPage.checkCourseStatus(course.id, 'Pending')
  })
}

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.type = CourseType.INDIRECT
    await use(course)
    await deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('admin') })

test(`create course: indirect as admin`, async ({ page, course }) => {
  const coursesListPage = new MyCoursesPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.selectCreateCourseOption(course.type)
  await createCoursePage.fillCourseDetails(course)
  course.id = await createCoursePage.clickCreateCourseButton()
  const courseBuilderPage = new CourseBuilderPage(page)
  const courseDetailsPage = await courseBuilderPage.clickSubmitButton()
  courseDetailsPage.header.checkCourseName(course.name)
  expect(page.url()).toContain(course.id)

  await coursesListPage.userMenu.selectOption(Option.Logout)
  const loginPage = new LoginPage(page)
  await loginPage.logIn(users.trainer2.email, users.trainer2.password)
  await coursesListPage.userMenu.checkIsVisible()
  await coursesListPage.roleSwitcher.selectRole('Trainer')
  await coursesListPage.coursesTable.checkIsVisible()
  await coursesListPage.checkCourseStatus(course.id, 'Pending')
})
