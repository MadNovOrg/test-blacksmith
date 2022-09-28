import React from 'react'

import { CourseType } from '@app/types'

import { render, screen } from '@test/index'

import { CreateCourseSteps } from '.'

describe('component: CreateCourseSteps', () => {
  it('displays correct steps for OPEN course type', () => {
    render(<CreateCourseSteps type={CourseType.OPEN} completedSteps={[]} />)

    expect(screen.getByText('Course details')).toBeInTheDocument()
    expect(screen.getByText('Assign trainer(s)')).toBeInTheDocument()
    expect(screen.getByText('Course builder')).toBeInTheDocument()

    expect(screen.queryByText('Review & confirm')).not.toBeInTheDocument()
    expect(screen.queryByText('Trainer expenses')).not.toBeInTheDocument()
    expect(screen.queryByText('Order details')).not.toBeInTheDocument()
  })

  it('displays correct steps for CLOSED course type', () => {
    render(<CreateCourseSteps type={CourseType.CLOSED} completedSteps={[]} />)

    expect(screen.getByText('Course details')).toBeInTheDocument()
    expect(screen.getByText('Assign trainer(s)')).toBeInTheDocument()
    expect(screen.getByText('Review & confirm')).toBeInTheDocument()
    expect(screen.getByText('Trainer expenses')).toBeInTheDocument()

    expect(screen.queryByText('Course builder')).not.toBeInTheDocument()
    expect(screen.queryByText('Order details')).not.toBeInTheDocument()
  })

  it('displays correct steps for INDIRECT course type', () => {
    render(<CreateCourseSteps type={CourseType.INDIRECT} completedSteps={[]} />)

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
        type={CourseType.INDIRECT}
        completedSteps={[]}
        blendedLearning
      />
    )

    expect(screen.getByText('Order details')).toBeInTheDocument()
    expect(screen.getByText('Review & confirm')).toBeInTheDocument()
  })
})
