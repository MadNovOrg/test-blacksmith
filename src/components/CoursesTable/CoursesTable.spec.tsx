import { useTranslation } from 'react-i18next'

import { GetProfileDetailsQuery } from '@app/generated/graphql'

import { _render, renderHook, screen } from '@test/index'
import { buildCourse, buildProfile } from '@test/mock-data-utils'

import { CoursesTable } from './CoursesTable'

describe(CoursesTable.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const profile = {
    ...buildProfile(),
    courses: [{ course: [{ ...buildCourse() }] }],
  } as unknown as GetProfileDetailsQuery['profile']
  beforeEach(() => _render(<CoursesTable profile={profile} />))
  it('should _render the component', () => {
    expect(screen.getByTestId('course-as-attendee')).toBeInTheDocument()
  })
  it.each([t('course-name'), t('action'), t('date')])(
    'should _render the table head cells: %s',
    cell => {
      expect(screen.getByText(cell)).toBeInTheDocument()
    },
  )
})
