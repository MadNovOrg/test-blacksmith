import React from 'react'
import { noop } from 'ts-essentials'

import { CourseLevel, CourseType } from '@app/types'

import { render, screen, userEvent } from '@test/index'

import { CourseLevelDropdown } from './index'

const getOption = (level: CourseLevel) => {
  return screen.getByTestId(`course-level-option-${level}`)
}

describe('component: CourseLevelDropdown', () => {
  it('renders correctly when type is OPEN', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.OPEN}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(4)

    expect(getOption(CourseLevel.Level_1)).toBeInTheDocument()
    expect(getOption(CourseLevel.IntermediateTrainer)).toBeInTheDocument()
    expect(getOption(CourseLevel.AdvancedTrainer)).toBeInTheDocument()
  })

  it('renders correctly when type is CLOSED', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.CLOSED}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(5)

    expect(getOption(CourseLevel.Level_1)).toBeInTheDocument()
    expect(getOption(CourseLevel.Level_2)).toBeInTheDocument()
    expect(getOption(CourseLevel.Advanced)).toBeInTheDocument()
    expect(getOption(CourseLevel.IntermediateTrainer)).toBeInTheDocument()
    expect(getOption(CourseLevel.AdvancedTrainer)).toBeInTheDocument()
  })

  it('renders correctly when type is INDIRECT', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.INDIRECT}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(CourseLevel.Level_1)).toBeInTheDocument()
    expect(getOption(CourseLevel.Level_2)).toBeInTheDocument()
    expect(getOption(CourseLevel.Advanced)).toBeInTheDocument()
  })
})
