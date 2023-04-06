import { test as base } from '@playwright/test'

import { Grade_Enum, Course_Source_Enum } from '@app/generated/graphql'
import { CourseType, InviteStatus } from '@app/types'

import * as API from '../../api'
import { FINISHED_COURSE } from '../../data/courses'
import { Course, User } from '../../data/types'
import { users } from '../../data/users'
import { stateFilePath } from '../../hooks/global-setup'
import { ProfilePage } from '../../pages/profile/ProfilePage'

const test = base.extend<{ grade: { course: Course; user: User } }>({
  grade: async ({}, use) => {
    const user = users.user1
    const course = FINISHED_COURSE()
    course.type = CourseType.CLOSED
    course.source = Course_Source_Enum.EmailEnquiry
    course.gradingConfirmed = true
    course.id = await API.course.insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
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
