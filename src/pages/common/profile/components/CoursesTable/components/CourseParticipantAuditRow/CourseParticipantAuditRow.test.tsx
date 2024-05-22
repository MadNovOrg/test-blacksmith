import { render } from '@testing-library/react'
import { t } from 'i18next'
import { I18nextProvider } from 'react-i18next'

import { Course_Participant_Audit_Type_Enum as ParticipantAuditType } from '@app/generated/graphql'
import i18n from '@app/i18n/config'

import { CourseParticipantAuditRow } from './CourseParticipantAuditRow'

const i18nextMock = i18n.createInstance()

describe('CourseParticipantAuditRow', () => {
  const courseInfo = {
    courseId: 1,
    courseName: 'Test Course',
    courseStartDate: '2024-05-15',
    auditType: ParticipantAuditType.Cancellation,
  }

  beforeAll(() => {
    i18nextMock.init({
      resources: {},
      lng: 'en',
    })
  })

  it('renders course name as link if audit type is Cancellation and user is not internal', () => {
    const { getByTestId } = render(
      <CourseParticipantAuditRow
        isInternalUser={false}
        courseInfo={courseInfo}
      />
    )
    const courseNameLink = getByTestId('course-name').querySelector('a')
    expect(courseNameLink).toBeInTheDocument()
    expect(courseNameLink?.getAttribute('href')).toBe('/courses/1/details')
  })

  it('renders course name as text if audit type is not Cancellation or user is internal', () => {
    const { getByTestId } = render(
      <CourseParticipantAuditRow
        isInternalUser={true}
        courseInfo={courseInfo}
      />
    )
    const courseNameLink = getByTestId('course-name').querySelector('a')
    expect(courseNameLink).not.toBeInTheDocument()
  })

  it('renders correct course action label', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nextMock}>
        <CourseParticipantAuditRow
          isInternalUser={true}
          courseInfo={courseInfo}
        />
      </I18nextProvider>
    )
    const courseAction = getByTestId('course-action')
    expect(courseAction.textContent).toBe(
      t(`participant-audit-types.CANCELLATION`)
    )
  })

  it('renders correct course start date', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nextMock}>
        <CourseParticipantAuditRow
          isInternalUser={true}
          courseInfo={courseInfo}
        />
      </I18nextProvider>
    )
    const courseStartDate = getByTestId('course-date')
    expect(courseStartDate.textContent).toBe('15 May 2024')
  })
})
