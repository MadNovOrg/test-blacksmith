import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import {
  deleteCourse,
  getModuleIds,
  insertCourse,
  insertCourseModules,
  insertCourseParticipants,
} from '../../../api/hasura-api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { getModulesByLevel } from '../../../data/modules'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'
import { inXMonths } from '../../../util'

const createCourses = async (): Promise<Course[]> => {
  const courses: Course[] = []
  for (let i = 0; i < 2; i++) {
    const course = UNIQUE_COURSE()
    course.type = CourseType.OPEN
    course.schedule[0].start = inXMonths(2)
    course.schedule[0].end = inXMonths(2)
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    const moduleIds = await getModuleIds(
      getModulesByLevel(course.level),
      course.level
    )
    course.id = await insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await insertCourseModules(course.id, moduleIds)
    courses.push(course)
  }
  return courses
}

const test = base.extend<{ courses: Course[] }>({
  courses: async ({}, use) => {
    const courses = await createCourses()
    await insertCourseParticipants(
      courses[0].id,
      [users.user1WithOrg],
      new Date()
    )
    await use(courses)
    for (const course of courses) {
      await deleteCourse(course.id)
    }
  },
})

test.use({ storageState: stateFilePath('userOrgAdmin') })

test(`transfer an attendee to another course `, async ({ page, courses }) => {
  const myCoursesPage = new MyCoursesPage(page)
  await myCoursesPage.gotoManageCourses()
  await myCoursesPage.searchCourse(`${courses[0].id}`)
  const courseDetailsPage = await myCoursesPage.clickCourseDetailsPage(
    courses[0].id
  )
  await courseDetailsPage.clickManageAttendance()
  const courseTransferPage = await courseDetailsPage.clickAttendeeTransfer()
  await courseTransferPage.selectCourseId(courses[1].id)
  await courseTransferPage.clickTransferDetails()
  // Need to see why this differs between manual and automated
  //await courseTransferPage.applyFeeGroup('FREE')
  await courseTransferPage.clickReviewAndConfirm()
  await courseTransferPage.clickConfirmTransfer()
  await myCoursesPage.gotoManageCourses()
  await myCoursesPage.searchCourse(`${courses[1].id}`)
  const courseDetailsPage1 = await myCoursesPage.clickCourseDetailsPage(
    courses[1].id
  )
  await courseDetailsPage1.checkAttendeeExists(users.user1WithOrg)
})
