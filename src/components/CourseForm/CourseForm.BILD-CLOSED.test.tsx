import React from 'react'

import { useCoursePrice } from '@app/hooks/useCoursePrice'
import { CourseLevel, CourseType, RoleName } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'

import { selectBildCategory, selectLevel } from './test-utils'

import CourseForm from '.'

jest.mock('@app/components/OrgSelector', () => ({
  OrgSelector: jest.fn(() => <p>Org Selector</p>),
}))

jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(() => <p>Venue Selector</p>),
}))

jest.mock('@app/hooks/useCoursePrice', () => ({
  useCoursePrice: jest.fn(),
}))

const useCoursePriceMock = jest.mocked(useCoursePrice)

describe('CourseForm - closed BILD', () => {
  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      price: null,
      fetching: false,
      currency: undefined,
      error: undefined,
    })
  })
  ;[RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN].forEach(role => {
    it(`allows ${role} user to select BILD in the dropdown`, async () => {
      await waitFor(() => {
        render(<CourseForm type={CourseType.CLOSED} />, {
          auth: { activeRole: role },
        })
      })

      expect(screen.getByLabelText(/course category/i)).toBeInTheDocument()
    })
  })

  it('displays all BILD course levels in the dropdown', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    await userEvent.click(screen.getByLabelText(/course level/i))

    expect(
      screen.getByTestId(
        `course-level-option-${CourseLevel.BildAdvancedTrainer}`
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(
        `course-level-option-${CourseLevel.BildIntermediateTrainer}`
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`course-level-option-${CourseLevel.BildRegular}`)
    ).toBeInTheDocument()
  })

  it('preselects and disables all strategies except Advanced for BILD Intermediate Trainer', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildIntermediateTrainer)

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
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildAdvancedTrainer)

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
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.queryByLabelText(/conversion/i)).not.toBeInTheDocument()

    await selectLevel(CourseLevel.BildIntermediateTrainer)

    const conversionToggle = screen.getByLabelText(/conversion course/i)
    expect(conversionToggle).toBeEnabled()

    await selectLevel(CourseLevel.BildAdvancedTrainer)
    expect(conversionToggle).toBeEnabled()
  })

  it('disables reaccreditation toggle if the conversion course is toggled', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildIntermediateTrainer)

    const conversionToggle = screen.getByLabelText(/conversion course/i)
    const reaccredToggle = screen.getByLabelText(/reaccreditation/i)

    await userEvent.click(conversionToggle)

    expect(reaccredToggle).toBeDisabled()
  })

  it('disables the conversion course toggle if the reaccreditation toggle is selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildIntermediateTrainer)

    const conversionToggle = screen.getByLabelText(/conversion course/i)
    const reaccredToggle = screen.getByLabelText(/reaccreditation/i)

    await userEvent.click(reaccredToggle)

    expect(conversionToggle).toBeDisabled()
  })

  it('disables virtual and mixed delivery type for BILD Certified level', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeDisabled()
  })

  it('enables virtual delivery type for BILD Certified if only Primary strategy is selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()

    await userEvent.click(screen.getByLabelText(/primary/i))

    expect(screen.getByLabelText(/virtual/i)).toBeEnabled()
  })

  it('disables mixed delivery type for BILD Advanced Trainer level', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildAdvancedTrainer)

    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeDisabled()
  })

  it('disables virtual delivery type for BILD Intermediate level', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildIntermediateTrainer)

    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeEnabled()
  })

  it('toggles blended learning flag', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByLabelText(/blended learning/i)).toBeDisabled()

    await userEvent.click(screen.getByLabelText(/primary/i))

    expect(screen.getByLabelText(/blended learning/i)).toBeEnabled()
  })

  it('displays price field', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument()
  })

  it("doesn't display a conversion toggle if a Bild Certified level is selected", async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.queryByLabelText(/conversion/i)).not.toBeInTheDocument()

    await selectLevel(CourseLevel.BildIntermediateTrainer)

    expect(screen.getByLabelText(/conversion/i)).toBeInTheDocument()
  })
})
