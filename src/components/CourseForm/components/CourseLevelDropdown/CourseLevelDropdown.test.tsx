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

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
    expect(getOption(CourseLevel.INTERMEDIATE_TRAINER)).toBeInTheDocument()
    expect(getOption(CourseLevel.ADVANCED_TRAINER)).toBeInTheDocument()
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

    expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
    expect(getOption(CourseLevel.LEVEL_2)).toBeInTheDocument()
    expect(getOption(CourseLevel.ADVANCED)).toBeInTheDocument()
    expect(getOption(CourseLevel.INTERMEDIATE_TRAINER)).toBeInTheDocument()
    expect(getOption(CourseLevel.ADVANCED_TRAINER)).toBeInTheDocument()
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

    expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
    expect(getOption(CourseLevel.LEVEL_2)).toBeInTheDocument()
    expect(getOption(CourseLevel.ADVANCED)).toBeInTheDocument()
  })
})
