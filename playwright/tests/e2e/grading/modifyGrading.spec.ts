import { test as base } from '@playwright/test'

import { Grade_Enum } from '@app/generated/graphql'
import { CourseType } from '@app/types'

import * as API from '@qa/api'
import { FINISHED_COURSE } from '@qa/data/courses'
import { Course, User } from '@qa/data/types'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { ProfilePage } from '@qa/pages/profile/ProfilePage'

const test = base.extend<{ grade: { course: Course; user: User } }>({
  grade: async ({}, use) => {
    const user = users.user1
    const course = FINISHED_COURSE()
    course.type = CourseType.CLOSED
    course.gradingConfirmed = true
    course.id = await API.course.insertCourse(course, users.trainer.email)
    await API.course.insertCourseParticipants(course.id, [user])
    await API.course.insertCourseGradingForParticipants(
      course,
      [user],
      Grade_Enum.Pass
    )
    await use({ course: course, user: user })
    await API.course.deleteCourse(course.id)
  },
})

test('admin can modify the grade of an attendee', async ({
  browser,
  grade,
}) => {
  const adminContext = await browser.newContext({
    storageState: stateFilePath('admin'),
  })
  const adminPage = await adminContext.newPage()
  const profilePage = await new ProfilePage(adminPage)
  await profilePage.goto(await API.profile.getProfileId(grade.user.email))
  const certificationPage = await profilePage.clickFirstCertificate()
  await certificationPage.clickManageCertification()
  const modifyModal = await certificationPage.clickModifyGrade()
  await modifyModal.setGrade(Grade_Enum.Fail)
  await modifyModal.addNote()
  await modifyModal.clickConfirm()
  await certificationPage.confirmGrade(Grade_Enum.Fail)
})
