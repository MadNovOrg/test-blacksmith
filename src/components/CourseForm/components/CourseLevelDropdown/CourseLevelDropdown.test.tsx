import React from 'react'
import { noop } from 'ts-essentials'

import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

import { render, screen, userEvent } from '@test/index'

import { CourseLevelDropdown } from './index'

const getOption = (level: CourseLevel) => {
  return screen.getByTestId(`course-level-option-${level}`)
}

describe('component: CourseLevelDropdown', () => {
  describe('type OPEN', () => {
    const courseType = CourseType.OPEN

    it('renders correctly when delivery is FACE2FACE', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.F2F}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(3)

      expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
      expect(getOption(CourseLevel.INTERMEDIATE_TRAINER)).toBeInTheDocument()
      expect(getOption(CourseLevel.ADVANCED_TRAINER)).toBeInTheDocument()
    })

    it('renders correctly when delivery is MIXED', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.MIXED}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(0)
    })

    it('renders correctly when delivery is VIRTUAL', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.VIRTUAL}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(1)

      expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
    })
  })

  describe('type CLOSED', () => {
    const courseType = CourseType.CLOSED

    it('renders correctly when delivery is FACE2FACE', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.F2F}
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

    it('renders correctly when delivery is MIXED', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.MIXED}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(2)

      expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
      expect(getOption(CourseLevel.LEVEL_2)).toBeInTheDocument()
    })

    it('renders correctly when delivery is VIRTUAL', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.VIRTUAL}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(1)

      expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
    })
  })

  describe('type INDIRECT', () => {
    const courseType = CourseType.INDIRECT

    it('renders correctly when delivery is FACE2FACE', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.F2F}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(3)

      expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
      expect(getOption(CourseLevel.LEVEL_2)).toBeInTheDocument()
      expect(getOption(CourseLevel.ADVANCED)).toBeInTheDocument()
    })

    it('renders correctly when delivery is MIXED', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.MIXED}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(2)

      expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
      expect(getOption(CourseLevel.LEVEL_2)).toBeInTheDocument()
    })

    it('renders correctly when delivery is VIRTUAL', () => {
      render(
        <CourseLevelDropdown
          value=""
          onChange={noop}
          courseType={courseType}
          deliveryType={CourseDeliveryType.VIRTUAL}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(1)

      expect(getOption(CourseLevel.LEVEL_1)).toBeInTheDocument()
    })
  })
})
