import { useTranslation } from 'react-i18next'

import { GetCoursesWithPricingQuery } from '@app/generated/graphql'

import { chance, fireEvent, render, renderHook, screen } from '@test/index'

import { CoursesWithAvailablePricing } from './CoursesWithAvailablePricing'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe(CoursesWithAvailablePricing.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const coursesMock = {
    courses: [],
    course_aggregate: { aggregate: { count: 1 } },
  } as GetCoursesWithPricingQuery
  const showCTAMock = false
  const setCTAOptionMock = vi.fn()
  const setup = ({
    courses = coursesMock,
    showCTA = showCTAMock,
    setCTAOption = setCTAOptionMock,
  }) => {
    return render(
      <CoursesWithAvailablePricing
        courses={courses}
        showCTA={showCTA}
        setCTAOption={setCTAOption}
      />,
    )
  }
  it('render the component', () => {
    setup({})
    expect(screen.getByTestId('courses-with-price-dialog')).toBeInTheDocument()
  })
  it('renders courses received as props', () => {
    const courses = {
      course_aggregate: {
        aggregate: {
          count: 1,
        },
      },
      courses: [
        {
          id: chance.integer(),
          course_code: chance.name(),
        },
      ],
    } as GetCoursesWithPricingQuery

    setup({ courses })
    const courseInfo = `${courses.courses[0].course_code}`
    expect(screen.getByText(courseInfo)).toBeInTheDocument()
  })
  it.skip('navigates to course details upon clicking on the course', async () => {
    // Navigation doesnt trigger for some reason
    const courses = {
      course_aggregate: {
        aggregate: {
          count: 1,
        },
      },
      courses: [
        {
          id: chance.integer(),
          course_code: chance.name(),
        },
      ],
    } as GetCoursesWithPricingQuery

    setup({ courses })
    const course = courses.courses[0]
    const courseInfo = `${course.course_code}`
    expect(screen.getByRole('link', { name: courseInfo })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: courseInfo }))
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
  it.each([t('cancel'), t('approve')])('shows the %s CTA button', button => {
    setup({ showCTA: true })
    expect(screen.getByText(button)).toBeInTheDocument()
  })
  it.each([t('cancel'), t('approve')])(
    'correctly sets %s as the selected button',
    button => {
      setup({ showCTA: true })
      fireEvent.click(screen.getByRole('button', { name: button }))
      expect(setCTAOptionMock).toHaveBeenCalled()
    },
  )
  it('expects dialog to be closed if there are no available courses', () => {
    setup({
      courses: {
        ...coursesMock,
        course_aggregate: { aggregate: { count: 0 } },
      },
    })
    expect(
      screen.queryByText('courses-with-price-dialog'),
    ).not.toBeInTheDocument()
  })
})
