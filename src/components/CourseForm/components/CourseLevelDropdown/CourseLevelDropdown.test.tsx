import React from 'react'
import { noop } from 'ts-essentials'

import { CourseDeliveryType, CourseType } from '@app/types'

import { render, screen, userEvent } from '@test/index'

import { CourseLevelDropdown } from './index'

describe('component: CourseLevelDropdown', () => {
  it('renders correct options for open virtual course', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.OPEN}
        deliveryType={CourseDeliveryType.VIRTUAL}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Level One')).toBeInTheDocument()
    expect(screen.queryByText('Level Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Advanced')).not.toBeInTheDocument()
  })

  it('renders correct options for closed virtual course', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.OPEN}
        deliveryType={CourseDeliveryType.VIRTUAL}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Level One')).toBeInTheDocument()
    expect(screen.queryByText('Level Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Advanced')).not.toBeInTheDocument()
  })
  it('renders correct options for indirect virtual course', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.OPEN}
        deliveryType={CourseDeliveryType.VIRTUAL}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Level One')).toBeInTheDocument()
    expect(screen.queryByText('Level Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Advanced')).not.toBeInTheDocument()
  })

  it('renders correct options for open F2F course', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.OPEN}
        deliveryType={CourseDeliveryType.F2F}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Level One')).toBeInTheDocument()
    expect(screen.getByText('Level Two')).toBeInTheDocument()
    expect(screen.queryByText('Advanced')).not.toBeInTheDocument()
  })

  it('renders correct options for closed F2F course', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.CLOSED}
        deliveryType={CourseDeliveryType.F2F}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Level One')).toBeInTheDocument()
    expect(screen.getByText('Level Two')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  it('renders correct options for indirect F2F course', () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={CourseType.INDIRECT}
        deliveryType={CourseDeliveryType.F2F}
      />
    )

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Level One')).toBeInTheDocument()
    expect(screen.getByText('Level Two')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })
})
