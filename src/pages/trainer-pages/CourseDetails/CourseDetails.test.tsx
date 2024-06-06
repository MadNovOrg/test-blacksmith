import { Route, Routes } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseDetails } from '.'

vi.mock('@app/hooks/useCourse')

const useCourseMocked = vi.mocked(useCourse)

describe('page: CourseDetails', () => {
  it('should render CourseHeroSummary component', () => {
    // Arrange
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })

    // Act
    render(
      <Routes>
        <Route path="/course/:id/details" element={<CourseDetails />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/course/${course.id}/details`] }
    )

    // Assert
    expect(screen.getByTestId('course-hero-summary')).toBeInTheDocument()
  })
})
