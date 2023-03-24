import { test as base } from '@playwright/test'

import { CourseDeliveryType } from '@app/types'

import { deleteCourse } from '../../../api/hasura-api'
import { TARGET_ENV } from '../../../constants'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
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

  test(`create course: ${data.name}`, async ({
    browser,
    browserName,
    course,
  }) => {
    // Disabled in firefox due to datepicker issues
    // Disabled locally due to venue setting not populating
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(browserName === 'firefox' || TARGET_ENV === 'local')
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
