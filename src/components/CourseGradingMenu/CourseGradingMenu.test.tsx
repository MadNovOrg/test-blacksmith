import React from 'react'

import { CourseDeliveryType, CourseLevel } from '@app/types'

import { render, screen, userEvent, within } from '@test/index'

import { CourseGradingMenu } from '.'

describe('component: CourseGradingMenu', () => {
  it('displays correct option for virtual L1 course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.Level_1}
        courseDeliveryType={CourseDeliveryType.VIRTUAL}
      />
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(
      within(menu).queryByText('Non-Physical Pass')
    ).not.toBeInTheDocument()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })

  it('displays correct options for F2F L1 course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.Level_1}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Non-Physical Pass')).toBeVisible()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })

  it('displays correct options for F2F L2 course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.Level_2}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Non-Physical Pass')).toBeVisible()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })

  it('displays correct options for advanced trainer F2F course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.AdvancedTrainer}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Assist only')).toBeVisible()
    expect(
      within(menu).queryByText('Non-Physical Pass')
    ).not.toBeInTheDocument()
  })

  it('displays correct options for intermediate trainer F2F course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.IntermediateTrainer}
        courseDeliveryType={CourseDeliveryType.F2F}
      />
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(within(menu).getByText('Assist only')).toBeVisible()
    expect(
      within(menu).queryByText('Non-Physical Pass')
    ).not.toBeInTheDocument()
  })

  it('displays correct options for blended course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={CourseLevel.Level_1}
        courseDeliveryType={CourseDeliveryType.MIXED}
      />
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(within(menu).getByText('Pass')).toBeVisible()
    expect(within(menu).getByText('Fail')).toBeVisible()
    expect(
      within(menu).queryByText('Non-Physical Pass')
    ).not.toBeInTheDocument()
    expect(within(menu).queryByText('Assist only')).not.toBeInTheDocument()
  })
})
