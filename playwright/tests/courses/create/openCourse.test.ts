import { test as base } from '@playwright/test'

import { CourseDeliveryType, CourseLevel } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { MyCoursesPage } from '@qa/fixtures/pages/courses/MyCoursesPage.fixture'
import { stateFilePath } from '@qa/hooks/global-setup'

const dataSet = [
  {
    name: 'open L1 virtual as admin',
    user: 'admin',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.VIRTUAL
      return course
    })(),
  },
  {
    name: 'open L1 virtual as ops',
    user: 'ops',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.VIRTUAL
      return course
    })(),
  },
  {
    name: 'open L1 F2F as ops',
    user: 'ops',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.deliveryType = CourseDeliveryType.F2F
      return course
    })(),
  },
  {
    name: 'open L2 mixed as admin',
    user: 'admin',
    course: (() => {
      const course = UNIQUE_COURSE()
      course.level = CourseLevel.Level_2
      course.deliveryType = CourseDeliveryType.MIXED
      return course
    })(),
  },

  //TODO uncomment after TTHP-575 will be moved to done
  // {
  //   name: 'open L2 F2F as sales admin',
  //   user: 'salesAdmin',
  //   course: (() => {
  //     const course = UNIQUE_COURSE()
  //     course.level = CourseLevel.Level_2
  //     course.deliveryType = CourseDeliveryType.F2F
  //     return course
  //   })(),
  // },
]

for (const data of dataSet) {
  const test = base.extend<{ course: Course }>({
    course: async ({}, use) => {
      await use(data.course)
      await API.course.deleteCourse(data.course.id)
    },
  })

  test(`create course: ${data.name}`, async ({
    browser,
    browserName,
    course,
  }) => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'firefox')
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
    course.id = await assignTrainersPage.getCourseIdOnCreation()

    const trainerContext = await browser.newContext({
      storageState: stateFilePath('trainer'),
    })
    const otherPage = await trainerContext.newPage()
    const trainerCoursesListPage = new MyCoursesPage(otherPage)
    await trainerCoursesListPage.goto(`${course.id}`)
    await trainerCoursesListPage.checkCourseWaitingApproval(course.id)
  })
}
