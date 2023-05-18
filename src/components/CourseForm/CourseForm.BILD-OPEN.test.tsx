import React from 'react'

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

describe('CourseForm - open BILD', () => {
  ;[RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS].forEach(role => {
    it(`allows ${role} to create open BILD course`, async () => {
      await waitFor(() => {
        render(<CourseForm type={CourseType.OPEN} />, {
          auth: { activeRole: role },
        })
      })

      expect(screen.getByLabelText(/course category/i)).toBeInTheDocument()
    })
  })

  it('displays BILD Intermediate Trainer and BILD Advanced trainer course levels', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />, {
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
      screen.queryByTestId(`course-level-option-${CourseLevel.BildRegular}`)
    ).not.toBeInTheDocument()
  })

  it('allows face to face and mixed delivery types if BILD Intermediate trainer course', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildIntermediateTrainer)

    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeEnabled()
    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
  })

  it('allows only face to face delivery type if BILD Advanced trainer course', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(CourseLevel.BildAdvancedTrainer)

    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeDisabled()
    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
  })

  it("doesn't allow blended learning on open BILD courses", async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByLabelText(/blended learning/i)).toBeDisabled()
  })

  it("disables reaccreditation if it's a conversion open BILD course", async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await userEvent.click(screen.getByLabelText(/conversion course/i))

    expect(screen.getByLabelText(/reaccreditation/i)).toBeDisabled()
  })

  it("disables conversion if it's a reaccreditation course", async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await userEvent.click(screen.getByLabelText(/reaccreditation/i))

    expect(screen.getByLabelText(/conversion course/i)).toBeDisabled()
  })

  it('displays price field for open BILD course', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(
      screen.getByPlaceholderText(/price per attendee/i)
    ).toBeInTheDocument()
  })
})
