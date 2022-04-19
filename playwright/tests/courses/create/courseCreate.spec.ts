/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { deleteCourse } from '../../../api/hasura-api'
import { Option } from '../../../components/UserMenu'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { LoginPage } from '../../../pages/auth/LoginPage'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const test = base.extend<{ course: Course }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = null
    await use(course)
    await deleteCourse(course.id)
  },
})
test.use({ storageState: stateFilePath('admin') })

// work in progress
test.skip('create open course', async ({ page, course }) => {
  const coursesListPage = new MyCoursesPage(page)
  await coursesListPage.goto()
  const createCoursePage =
    await coursesListPage.createCourseMenu.selectCreateCourseOption(course.type)
  await createCoursePage.fillOpenCourseDetails(course)
  const assignTrainersPage = await createCoursePage.clickAssignTrainersButton()
  await assignTrainersPage.selectTrainer(users.trainer2)
  course.id = await assignTrainersPage.clickCreateCourseButton()
  await coursesListPage.userMenu.selectOption(Option.Logout)
  const loginPage = new LoginPage(page)
  await loginPage.logIn(users.trainer2.email, users.trainer2.password)
  coursesListPage.checkCourseStatus(course.id, 'Pending')
})
