import { Course_Type_Enum } from '@app/generated/graphql'

import { render, screen } from '@test/index'

import { CreateCourseSteps } from '.'

describe('component: CreateCourseSteps', () => {
  it('displays correct steps for OPEN course type', () => {
    render(
      <CreateCourseSteps type={Course_Type_Enum.Open} completedSteps={[]} />,
    )

    expect(screen.getByText('Course details')).toBeInTheDocument()
    expect(screen.getByText('Assign trainer(s)')).toBeInTheDocument()
    expect(screen.getByText('Course builder')).toBeInTheDocument()

    expect(screen.queryByText('Review & confirm')).not.toBeInTheDocument()
    expect(screen.queryByText('Trainer expenses')).not.toBeInTheDocument()
    expect(screen.queryByText('Order details')).not.toBeInTheDocument()
  })

  it('displays correct steps for CLOSED course type', () => {
    render(
      <CreateCourseSteps type={Course_Type_Enum.Closed} completedSteps={[]} />,
    )

    expect(screen.getByText('Course details')).toBeInTheDocument()
    expect(screen.getByText('Assign trainer(s)')).toBeInTheDocument()
    expect(screen.getByText('Trainer expenses')).toBeInTheDocument()
    expect(screen.queryByText('Order details')).toBeInTheDocument()
    expect(screen.getByText('Review & confirm')).toBeInTheDocument()

    expect(screen.queryByText('Course builder')).not.toBeInTheDocument()
  })

  it('displays correct steps for INDIRECT course type', () => {
    render(
      <CreateCourseSteps
        type={Course_Type_Enum.Indirect}
        completedSteps={[]}
      />,
    )

    expect(screen.getByText('Course details')).toBeInTheDocument()
    expect(screen.getByText('Course builder')).toBeInTheDocument()

    expect(screen.queryByText('Assign trainer(s)')).not.toBeInTheDocument()
    expect(screen.queryByText('Review & confirm')).not.toBeInTheDocument()
    expect(screen.queryByText('Trainer expenses')).not.toBeInTheDocument()
    expect(screen.queryByText('Order details')).not.toBeInTheDocument()
  })

  it('adds correct steps when a course has Go1 integration', () => {
    render(
      <CreateCourseSteps
        type={Course_Type_Enum.Indirect}
        completedSteps={[]}
        blendedLearning
      />,
    )

    expect(screen.getByText('Order details')).toBeInTheDocument()
    expect(screen.getByText('Review & confirm')).toBeInTheDocument()
  })
})
