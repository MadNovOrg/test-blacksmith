import { t } from 'i18next'

import {
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'
import i18n from '@app/i18n/config'

import { _render } from '@test/index'

import { CourseTrainerRow, trainerTypeLabelMap } from './CourseTrainerRow'

const courseId = 1
const courseCode = 'TEST123'
const courseStatus = Course_Status_Enum.Scheduled
const trainingLevel = Course_Trainer_Type_Enum.Leader
const startDate = '2024-05-15'

const i18nextMock = i18n.createInstance()

describe('CourseTrainerRow', () => {
  beforeAll(() => {
    i18nextMock.init({
      resources: {},
      lng: 'en',
    })
  })

  it('renders course trainer row with correct information', () => {
    const { getByText, getByTestId } = _render(
      <CourseTrainerRow
        courseCode={courseCode}
        courseId={courseId}
        trainingLevel={trainingLevel}
        courseStatus={courseStatus}
        courseStartDate={startDate}
      />,
    )

    const courseCodeLink = getByText(courseCode)
    expect(courseCodeLink).toBeInTheDocument()
    expect(courseCodeLink.closest('a')).toHaveAttribute(
      'href',
      `/courses/${courseId}/details`,
    )

    const trainerTypeLabel = getByTestId('trainer-level')
    expect(trainerTypeLabel.textContent).toBe(
      t(
        `components.trainer-avatar-group.${trainerTypeLabelMap[trainingLevel]}`,
      ),
    )

    const courseStatusChip = getByTestId('course-status-chip')
    expect(courseStatusChip.textContent).toBe(
      t(`course-statuses.${courseStatus}`),
    )

    const courseStartDate = getByText('15 May 2024')
    expect(courseStartDate).toBeInTheDocument()
  })
})
