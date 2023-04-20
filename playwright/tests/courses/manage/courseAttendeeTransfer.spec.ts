import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus } from '@app/types'

import * as API from '../../../api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { MyCoursesPage } from '../../../pages/courses/MyCoursesPage'

const allowedRoles = ['userOrgAdmin', 'salesAdmin']

const createCourses = async (): Promise<Course[]> => {
  const courses: Course[] = []
  for (let i = 0; i < 2; i++) {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    course.id = await API.course.insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    courses.push(course)
  }
  return courses
}

const test = base.extend<{ courses: Course[] }>({
  courses: async ({}, use) => {
    const courses = await createCourses()
    await API.course.insertCourseParticipants(courses[0].id, [
      users.user1WithOrg,
    ])
    await use(courses)
    for (const course of courses) {
      await API.course.deleteCourse(course.id)
    }
  },
})

allowedRoles.forEach(role => {
  test.use({ storageState: stateFilePath(role) })

  test(`${role} can transfer an attendee to another course `, async ({
    page,
    courses,
  }) => {
    const myCoursesPage = new MyCoursesPage(page)
    await myCoursesPage.gotoManageCourses(`${courses[0].id}`)
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
    await myCoursesPage.gotoManageCourses(`${courses[1].id}`)
    const courseDetailsPage1 = await myCoursesPage.clickCourseDetailsPage(
      courses[1].id
    )
    await courseDetailsPage1.checkAttendeeExists(users.user1WithOrg)
  })
})
