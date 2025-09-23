import { _render } from '@test/index'

import { CourseTitle } from './CourseTitle'

describe('CourseTitle', () => {
  it('renders the course name', () => {
    const { getByTestId } = _render(
      <CourseTitle name="Test Course" code="12345" />,
    )
    const courseTitle = getByTestId('course-title')
    expect(courseTitle).toBeInTheDocument()
    expect(courseTitle.textContent).toBe('Test Course')
  })

  it('renders the course code when provided', () => {
    const { getByTestId } = _render(
      <CourseTitle name="Test Course" code="12345" />,
    )
    const courseCode = getByTestId('course-code')
    expect(courseCode).toBeInTheDocument()
    expect(courseCode.textContent).toBe('12345')
  })

  it('renders empty course code when null', () => {
    const { getByTestId } = _render(
      <CourseTitle name="Test Course" code={null} />,
    )
    const courseCode = getByTestId('course-code')
    expect(courseCode).toBeInTheDocument()
    expect(courseCode.textContent).toBe('')
  })

  it('renders empty course code when undefined', () => {
    const { getByTestId } = _render(
      <CourseTitle name="Test Course" code={undefined} />,
    )
    const courseCode = getByTestId('course-code')
    expect(courseCode).toBeInTheDocument()
    expect(courseCode.textContent).toBe('')
  })
})
