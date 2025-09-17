import { t } from 'i18next'

import { Course_Type_Enum } from '@app/generated/graphql'
import i18n from '@app/i18n/config'
import { TableCourse } from '@app/modules/trainer_courses/utils'

import { _render } from '@test/index'

import { TypeCell } from './TypeCell'

const i18nextMock = i18n.createInstance()
describe('TypeCell', () => {
  const course = {
    type: Course_Type_Enum.Closed,
    go1Integration: true,
  }

  beforeAll(() => {
    i18nextMock.init({
      resources: {},
      lng: 'en',
    })
  })

  it('renders the correct course type', () => {
    const { getByText } = _render(
      <TypeCell course={course as unknown as TableCourse} />,
    )
    const courseTypeElement = getByText(t(`course-types.${course.type}`))
    expect(courseTypeElement).toBeInTheDocument()
  })

  it('renders the blended learning indicator if go1Integration is true', () => {
    const { getByText } = _render(
      <TypeCell course={course as unknown as TableCourse} />,
    )
    const blendedLearningElement = getByText(t('common.blended-learning'))
    expect(blendedLearningElement).toBeInTheDocument()
  })

  it('does not _render the blended learning indicator if go1Integration is false', () => {
    const courseWithoutBlendedLearning = {
      ...course,
      go1Integration: false,
    }
    const { queryByText } = _render(
      <TypeCell
        course={courseWithoutBlendedLearning as unknown as TableCourse}
      />,
    )
    const blendedLearningElement = queryByText(t('common.blended-learning'))
    expect(blendedLearningElement).not.toBeInTheDocument()
  })
})
