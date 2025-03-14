import { render } from '@testing-library/react'

import { Course_Status_Enum } from '@app/generated/graphql'

import { CourseParticipantRow } from './CourseParticipantRow'

describe('CourseParticipantRow', () => {
  const courseInfo = {
    courseId: 1,
    courseName: 'Test Course',
    courseStatus: Course_Status_Enum.Scheduled,
    attended: true,
    courseStartDate: '2024-05-15',
  }

  it('renders course name as link if showLink is true', () => {
    const { getByTestId } = render(
      <CourseParticipantRow courseInfo={courseInfo} isInternalUser={true} />,
    )
    const courseNameLink = getByTestId('course-name').querySelector('a')
    expect(courseNameLink).toBeInTheDocument()
    expect(courseNameLink?.getAttribute('href')).toBe('/courses/1/details')
  })

  it('renders course name as text if showLink is false', () => {
    const { getByTestId } = render(
      <CourseParticipantRow
        courseInfo={{
          ...courseInfo,
          courseStatus: Course_Status_Enum.Cancelled,
        }}
        isInternalUser={false}
      />,
    )
    const courseNameLink = getByTestId('course-name').querySelector('a')
    expect(courseNameLink).not.toBeInTheDocument()
  })

  it('renders correct course action label', () => {
    const { getByTestId } = render(
      <CourseParticipantRow courseInfo={courseInfo} />,
    )
    const courseAction = getByTestId('course-action')
    expect(courseAction.textContent).toBe('Attended')
  })

  it('renders correct course start date', () => {
    const { getByText } = render(
      <CourseParticipantRow courseInfo={courseInfo} />,
    )
    const courseStartDate = getByText('15 May 2024')
    expect(courseStartDate).toBeInTheDocument()
  })

  it('does not render if shouldShowTheRow is false', () => {
    const { container } = render(
      <CourseParticipantRow
        courseInfo={{
          ...courseInfo,
          courseStatus: undefined,
        }}
      />,
    )
    expect(container.firstChild).toBeNull()
  })
})
