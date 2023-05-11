import React from 'react'

import { Course_Level_Enum } from '@app/generated/graphql'
import { CourseType, RoleName } from '@app/types'

import { act, render, screen, userEvent, waitFor, within } from '@test/index'

import CourseForm from '.'

jest.mock('@app/components/OrgSelector', () => ({
  OrgSelector: jest.fn(() => <p>Org Selector</p>),
}))

jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(() => <p>Venue Selector</p>),
}))

async function selectBildCategory() {
  await userEvent.click(screen.getByLabelText(/course category/i))
  await userEvent.click(within(screen.getByRole('listbox')).getByText(/bild/i))
}

async function selectCourseLevel(level: Course_Level_Enum) {
  await userEvent.click(screen.getByLabelText(/course level/i))
  await userEvent.click(screen.getByTestId(`course-level-option-${level}`))
}

describe('CourseForm - closed BILD', () => {
  ;[RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].forEach(role => {
    it(`allows ${role} user to select BILD in the dropdown`, async () => {
      act(() => {
        render(<CourseForm type={CourseType.CLOSED} />, {
          auth: { activeRole: role },
        })
      })

      expect(screen.getByLabelText(/course category/i)).toBeInTheDocument()
    })
  })

  it('displays all BILD course levels in the dropdown', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    await userEvent.click(screen.getByLabelText(/course level/i))

    expect(
      screen.getByTestId(
        `course-level-option-${Course_Level_Enum.BildAdvancedTrainer}`
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(
        `course-level-option-${Course_Level_Enum.BildIntermediateTrainer}`
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`course-level-option-${Course_Level_Enum.BildRegular}`)
    ).toBeInTheDocument()
  })

  it('preselects and disables all strategies except Advanced for BILD Intermediate Trainer', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectCourseLevel(Course_Level_Enum.BildIntermediateTrainer)

    await waitFor(() => {
      expect(screen.getByLabelText(/primary/i)).toBeChecked()
      expect(screen.getByLabelText(/primary/i)).toBeDisabled()

      expect(screen.getByLabelText(/secondary/i)).toBeChecked()
      expect(screen.getByLabelText(/secondary/i)).toBeDisabled()

      expect(screen.getByLabelText(/non restrictive tertiary/i)).toBeChecked()
      expect(screen.getByLabelText(/non restrictive tertiary/i)).toBeDisabled()

      expect(
        screen.getByLabelText(/restrictive tertiary intermediate/i)
      ).toBeChecked()
      expect(
        screen.getByLabelText(/restrictive tertiary intermediate/i)
      ).toBeDisabled()

      expect(
        screen.getByLabelText(/restrictive tertiary advanced/i)
      ).not.toBeChecked()
      expect(
        screen.getByLabelText(/restrictive tertiary advanced/i)
      ).toBeDisabled()
    })
  })

  it('preselects and disables all strategies for BILD Advanced Trainer', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectCourseLevel(Course_Level_Enum.BildAdvancedTrainer)

    await waitFor(() => {
      expect(screen.getByLabelText(/primary/i)).toBeChecked()
      expect(screen.getByLabelText(/primary/i)).toBeDisabled()

      expect(screen.getByLabelText(/secondary/i)).toBeChecked()
      expect(screen.getByLabelText(/secondary/i)).toBeDisabled()

      expect(screen.getByLabelText(/non restrictive tertiary/i)).toBeChecked()
      expect(screen.getByLabelText(/non restrictive tertiary/i)).toBeDisabled()

      expect(
        screen.getByLabelText(/restrictive tertiary intermediate/i)
      ).toBeChecked()
      expect(
        screen.getByLabelText(/restrictive tertiary intermediate/i)
      ).toBeDisabled()

      expect(
        screen.getByLabelText(/restrictive tertiary advanced/i)
      ).toBeChecked()
      expect(
        screen.getByLabelText(/restrictive tertiary advanced/i)
      ).toBeDisabled()
    })
  })

  it('enables a conversion course toggle if BILD Intermediate or BILD Advanced Trainer level is selected', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    const conversionToggle = screen.getByLabelText(/conversion course/i)

    expect(conversionToggle).toBeDisabled()

    await selectCourseLevel(Course_Level_Enum.BildIntermediateTrainer)
    expect(conversionToggle).toBeEnabled()

    await selectCourseLevel(Course_Level_Enum.BildAdvancedTrainer)
    expect(conversionToggle).toBeEnabled()
  })

  it('disables reaccreditation toggle if the conversion course is toggled', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectCourseLevel(Course_Level_Enum.BildIntermediateTrainer)

    const conversionToggle = screen.getByLabelText(/conversion course/i)
    const reaccredToggle = screen.getByLabelText(/reaccreditation/i)

    await userEvent.click(conversionToggle)

    expect(reaccredToggle).toBeDisabled()
  })

  it('disables the conversion course toggle if the reaccreditation toggle is selected', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectCourseLevel(Course_Level_Enum.BildIntermediateTrainer)

    const conversionToggle = screen.getByLabelText(/conversion course/i)
    const reaccredToggle = screen.getByLabelText(/reaccreditation/i)

    await userEvent.click(reaccredToggle)

    expect(conversionToggle).toBeDisabled()
  })

  it('disables virtual and mixed delivery type for BILD Certified level', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeDisabled()
  })

  it('disables mixed delivery type for BILD Advanced Trainer level', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectCourseLevel(Course_Level_Enum.BildAdvancedTrainer)

    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeDisabled()
  })

  it('disables virtual delivery type for BILD Intermediate level', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectCourseLevel(Course_Level_Enum.BildIntermediateTrainer)

    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeEnabled()
  })

  it('disables blended learning toggle', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByLabelText(/blended learning/i)).toBeDisabled()
  })

  it('displays price field', async () => {
    act(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument()
  })
})
