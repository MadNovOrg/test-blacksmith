import React from 'react'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'

import { render, screen, userEvent, within } from '@test/index'

import { CourseGradingMenu } from '.'

describe('component: CourseGradingMenu', () => {
  it('displays correct option for virtual L1 course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.Level_1}
        courseDeliveryType={Course_Delivery_Type_Enum.Virtual}
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
        courseLevel={Course_Level_Enum.Level_1}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
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
        courseLevel={Course_Level_Enum.Level_2}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
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
        courseLevel={Course_Level_Enum.AdvancedTrainer}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
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
        courseLevel={Course_Level_Enum.IntermediateTrainer}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
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
        courseLevel={Course_Level_Enum.Level_1}
        courseDeliveryType={Course_Delivery_Type_Enum.Mixed}
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
