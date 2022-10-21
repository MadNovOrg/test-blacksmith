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
    name: 'closed f2f as admin',
    user: 'admin',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.type = CourseType.CLOSED
      course.organization = { name: 'London First School' }
      course.contactProfile = users.userOrgAdmin
      return course
    })(),
  },
  {
    name: 'open virtual as ops',
    user: 'ops',
    course: (() => {
      const course = UNIQUE_COURSE()
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
      course.organization = { name: 'London First School' }
      course.contactProfile = users.userOrgAdmin
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

  test.fixme(
    `create course: ${data.name}, fails because of Material UI datepicker masked input`,
    async ({ page, course }) => {
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
    }
  )
}
