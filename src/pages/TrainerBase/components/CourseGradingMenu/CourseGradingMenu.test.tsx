import React from 'react'

import { CourseLevel, CourseDeliveryType } from '@app/types'

import { render, screen, userEvent, within } from '@test/index'

import { CourseGradingMenu } from '.'

describe('component: CourseGradingMenu', () => {
  it('displays correct option for virtual L1 course', () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.LEVEL_1}
        courseDeliveryType={CourseDeliveryType.VIRTUAL}
      />
    )

    userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).queryByText('Observe only')).not.toBeInTheDocument()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })

  it('displays correct options for F2F L1 course', () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.LEVEL_1}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Observe only')).toBeVisible()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })

  it('displays correct options for F2F L2 course', () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.LEVEL_2}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Observe only')).toBeVisible()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })

  it('displays correct options for advanced F2F course', () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.ADVANCED}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Assist only')).toBeVisible()
    expect(within(menu).queryByText('Observe only')).not.toBeInTheDocument()
  })

  it('displays correct options for intermediate F2F course', () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.INTERMEDIATE}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Assist only')).toBeVisible()
    expect(within(menu).queryByText('Observe only')).not.toBeInTheDocument()
  })

  it('displays correct options for blended course', () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.LEVEL_1}
        courseDeliveryType={CourseDeliveryType.BLENDED}
      />
    )

    userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).queryByText('Observe only')).not.toBeInTheDocument()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })
})
