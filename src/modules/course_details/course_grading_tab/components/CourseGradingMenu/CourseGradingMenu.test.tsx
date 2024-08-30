import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'

import { render, renderHook, screen, userEvent, within } from '@test/index'

import { CourseGradingMenu } from './CourseGradingMenu'

describe('component: CourseGradingMenu', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('displays correct option for virtual L1 course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.Level_1}
        courseDeliveryType={Course_Delivery_Type_Enum.Virtual}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).queryByText(t('pages.course-grading.grade-pass')),
    ).not.toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-non-physical')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
  })

  it('displays correct options for F2F L1 course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.Level_1}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-non-physical')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
  })

  it('displays correct options for F2F L2 course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.Level_2}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-non-physical')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
  })

  it('displays correct options for the advanced modules course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.Advanced}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-non-physical')),
    ).not.toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
  })

  it('displays correct options for advanced trainer F2F course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.AdvancedTrainer}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-assist-only')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-non-physical')),
    ).not.toBeInTheDocument()
  })

  it('displays correct options for intermediate trainer F2F course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.IntermediateTrainer}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-assist-only')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-non-physical')),
    ).not.toBeInTheDocument()
  })

  it('displays correct options for blended course', async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.Level_1}
        courseDeliveryType={Course_Delivery_Type_Enum.Mixed}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-non-physical')),
    ).not.toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
  })

  it(`displays correct options for ${Course_Level_Enum.BildRegular}`, async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.BildRegular}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-non-physical')),
    ).not.toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
  })

  it(`displays correct options for ${Course_Level_Enum.BildIntermediateTrainer}`, async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.BildIntermediateTrainer}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-non-physical')),
    ).not.toBeInTheDocument()
  })

  it(`displays correct options for ${Course_Level_Enum.BildAdvancedTrainer}`, async () => {
    render(
      <CourseGradingMenu
        courseLevel={Course_Level_Enum.BildAdvancedTrainer}
        courseDeliveryType={Course_Delivery_Type_Enum.F2F}
      />,
    )

    await userEvent.click(screen.getByTestId('course-grading-menu-selected'))

    const menu = screen.getByTestId('course-grading-options')

    expect(
      within(menu).getByText(t('pages.course-grading.grade-pass')),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText(t('pages.course-grading.grade-fail')),
    ).toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-assist-only')),
    ).not.toBeInTheDocument()
    expect(
      within(menu).queryByText(t('pages.course-grading.grade-non-physical')),
    ).not.toBeInTheDocument()
  })
})
