import { Route, Routes } from 'react-router-dom'

import { Course_Level_Enum, ResourceCategory } from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { useResourceAreas } from '@app/modules/resources/hooks/use-resource-areas'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseDetails, preCourseMaterialLevels } from '.'

const mockNavigate = vi.fn()

vi.mock('@app/hooks/useCourse')
vi.mock('@app/modules/resources/hooks/use-resource-areas')
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

const useCourseMocked = vi.mocked(useCourse)
const useResourcesMocked = vi.mocked(useResourceAreas)

describe('page: CourseDetails', () => {
  it('should render CourseHeroSummary component', () => {
    // Arrange
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })

    useResourcesMocked.mockReturnValue({
      fetching: false,
      allResourcesByArea: {
        basic: [],
      },
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
      { initialEntries: [`/course/${course.id}/details`] },
    )

    // Assert
    expect(screen.getByTestId('course-hero-summary')).toBeInTheDocument()
  })
  it.each(preCourseMaterialLevels)(
    'should show course materials tab for %s level',
    level => {
      const course = buildCourse({
        overrides: {
          level,
        },
      })

      useCourseMocked.mockReturnValue({
        mutate: vi.fn(),
        data: { course },
        status: LoadingStatus.SUCCESS,
      })
      useResourcesMocked.mockReturnValue({
        fetching: false,
        allResourcesByArea: {
          basic: [
            {
              name: 'Course Materials',
              databaseId: 1,
              id: '1',
            } as ResourceCategory,
          ],
        },
      })

      render(
        <Routes>
          <Route path="/course/:id/details" element={<CourseDetails />} />
        </Routes>,
        {
          auth: {
            activeRole: RoleName.TT_ADMIN,
          },
        },
        { initialEntries: [`/course/${course.id}/details`] },
      )
      expect(screen.getByTestId('course-materials-tab')).toBeInTheDocument()
    },
  )
  it('navigates to resources page upon click on the course materials tab', async () => {
    const course = buildCourse()
    const courseMaterialsSectionId = chance.guid()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })

    useResourcesMocked.mockReturnValue({
      fetching: false,
      allResourcesByArea: {
        basic: [
          {
            name: 'Course Materials',
            databaseId: 1,
            id: courseMaterialsSectionId,
          } as ResourceCategory,
        ],
      },
    })

    render(
      <Routes>
        <Route path="/course/:id/details" element={<CourseDetails />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/course/${course.id}/details`] },
    )
    await userEvent.click(screen.getByTestId('course-materials-tab'))
    expect(mockNavigate).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith(
      `/resources/${courseMaterialsSectionId}`,
    )
  })
  it('should not display the course materials tab if level is different than the defined levels', () => {
    const course = buildCourse({
      overrides: {
        level: Course_Level_Enum.BildAdvancedTrainer,
      },
    })
    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })

    useResourcesMocked.mockReturnValue({
      fetching: false,
      allResourcesByArea: {
        basic: [
          {
            name: 'Course Materials',
            databaseId: 1,
            id: '1',
          } as ResourceCategory,
        ],
      },
    })

    render(
      <Routes>
        <Route path="/course/:id/details" element={<CourseDetails />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/course/${course.id}/details`] },
    )

    expect(screen.queryByTestId('course-materials-tab')).not.toBeInTheDocument()
  })
  it('should not display the course materials tab the course materials folder does not exist as a resource', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })

    useResourcesMocked.mockReturnValue({
      fetching: false,
      allResourcesByArea: {
        basic: [
          {
            name: 'Other resource',
            databaseId: 1,
            id: '1',
          } as ResourceCategory,
        ],
      },
    })

    render(
      <Routes>
        <Route path="/course/:id/details" element={<CourseDetails />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/course/${course.id}/details`] },
    )

    expect(screen.queryByTestId('course-materials-tab')).not.toBeInTheDocument()
  })
  it('should display the loading state if the resources call didnt finish ', () => {
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
      status: LoadingStatus.SUCCESS,
    })

    useResourcesMocked.mockReturnValue({
      fetching: true,
      allResourcesByArea: {
        basic: [],
      },
    })

    render(
      <Routes>
        <Route path="/course/:id/details" element={<CourseDetails />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/course/${course.id}/details`] },
    )

    expect(
      screen.getByTestId('course-materials-loading-state'),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('course-materials-tab')).not.toBeInTheDocument()
  })
})
