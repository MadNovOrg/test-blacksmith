import { Course_Type_Enum } from '@app/generated/graphql'

import { render, screen, userEvent } from '@test/index'

import { CourseForm } from '..'
import { renderForm } from '../test-utils'

import { AttendeesSection } from './AttendeesSection'

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

describe(`component: ${AttendeesSection.name}`, () => {
  it('validates that min participants is smaller than max participants', async () => {
    render(<CourseForm type={Course_Type_Enum.Open} />)

    await userEvent.type(
      screen.getByLabelText('Minimum', { exact: false }),
      '6',
    )
    await userEvent.type(
      screen.getByLabelText('Maximum', { exact: false }),
      '5',
    )

    expect(
      screen.getByText(
        'Minimum number of attendees must be less than the maximum number of attendees',
      ),
    ).toBeInTheDocument()
  })

  it('validates that minimum participants has to be positive number', async () => {
    render(<CourseForm type={Course_Type_Enum.Open} />)

    await userEvent.type(
      screen.getByLabelText('Minimum', { exact: false }),
      '0',
    )

    expect(
      await screen.findByText(
        'Minimum number of attendees must be a positive number',
      ),
    ).toBeInTheDocument()
  })

  it('does not render minimum participants for closed course type', async () => {
    renderForm(Course_Type_Enum.Closed)

    expect(
      screen.queryByLabelText('Minimum', { exact: false }),
    ).not.toBeInTheDocument()
  })

  it('does not render minimum participants for indirect course type', async () => {
    renderForm(Course_Type_Enum.Indirect)

    expect(
      screen.queryByLabelText('Minimum', { exact: false }),
    ).not.toBeInTheDocument()
  })
})
