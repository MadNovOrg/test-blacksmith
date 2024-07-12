import { Routes, Route } from 'react-router-dom'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import {
  CourseDetails,
  preCourseMaterialLevels,
} from '@app/modules/course_details/pages/CourseDetails'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { PreCourseMaterialsTab } from './PreCourseMaterialsTab'

vi.mock('@app/hooks/useCourse')

const useCourseMocked = vi.mocked(useCourse)

describe(`component: ${PreCourseMaterialsTab.name}`, () => {
  it.each(preCourseMaterialLevels)(
    'should display the pre-course materials tab for level %s',
    async level => {
      // Arrange
      const course = buildCourse({
        overrides: {
          type: Course_Type_Enum.Open,
          level,
        },
      })

      useCourseMocked.mockReturnValue({
        mutate: vi.fn(),
        data: { course },
        status: LoadingStatus.SUCCESS,
      })

      // Act
      render(
        <Routes>
          <Route path={`/courses/:id/details`} element={<CourseDetails />} />
        </Routes>,
        {
          auth: {
            activeRole: RoleName.TT_ADMIN,
          },
        },
        { initialEntries: [`/courses/${course.id}/details`] },
      )

      // Assert
      expect(screen.getByTestId('pre-course-materials-tab')).toBeInTheDocument()
    },
  )

  it('should not display the pre-course materials tab for other levels', () => {
    // Arrange
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Open,
        level: Course_Level_Enum.AdvancedTrainer,
      },
    })

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })

    // Act
    render(
      <Routes>
        <Route path={`/courses/:id/details`} element={<CourseDetails />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/${course.id}/details`] },
    )

    // Assert
    expect(
      screen.queryByTestId('pre-course-materials-tab'),
    ).not.toBeInTheDocument()
  })
})
