import React from 'react'

import { Course_Level_Enum } from '@app/generated/graphql'
import { CourseLevel, CourseType, RoleName } from '@app/types'

import { render, screen, userEvent, waitFor, within } from '@test/index'

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

describe('CourseForm - indirect BILD', () => {
  it('allows a trainer with a BILD Intermediate trainer certificate to create a BILD course', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildIntermediateTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await userEvent.click(screen.getByLabelText(/course category/i))

    expect(
      within(screen.getByRole('listbox')).getByText(/bild/i)
    ).toBeInTheDocument()
  })

  it('allows a trainer with an BILD Advanced trainer certificate to create a BILD course', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await userEvent.click(screen.getByLabelText(/course category/i))

    expect(
      within(screen.getByRole('listbox')).getByText(/bild/i)
    ).toBeInTheDocument()
  })

  it(`displays only ${Course_Level_Enum.BildRegular} course level`, async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    await userEvent.click(screen.getByLabelText(/course level/i))

    expect(
      screen.queryByTestId(
        `course-level-option-${Course_Level_Enum.BildAdvancedTrainer}`
      )
    ).not.toBeInTheDocument()

    expect(
      screen.queryByTestId(
        `course-level-option-${Course_Level_Enum.BildIntermediateTrainer}`
      )
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`course-level-option-${Course_Level_Enum.BildRegular}`)
    ).toBeInTheDocument()
  })

  it("doesn't allow a trainer to toggle Restrictive Tertiary Advanced strategy if BILD Intermediate trainer certified", async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildIntermediateTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    expect(
      screen.getByLabelText(/restrictive tertiary advanced/i)
    ).toBeDisabled()
  })

  it('allows a trainer to toggle Restrictive Tertiary Advanced strategy if BILD Advanced trainer certified', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    expect(
      screen.getByLabelText(/restrictive tertiary advanced/i)
    ).toBeEnabled()
  })

  it('enables Blended learning toggle if Primary strategy is the only one selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    const blendedLearningToggle = screen.getByLabelText(/blended learning/i)

    await userEvent.click(screen.getByLabelText(/primary/i))
    expect(blendedLearningToggle).toBeEnabled()

    await userEvent.click(screen.getByLabelText(/secondary/i))
    expect(blendedLearningToggle).toBeDisabled()
  })

  it('enables Virtual delivery type if Primary srategy is the only one selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    const virtualDeliveryToggle = screen.getByLabelText(/virtual/i)

    await userEvent.click(screen.getByLabelText(/primary/i))
    expect(virtualDeliveryToggle).toBeEnabled()

    await userEvent.click(screen.getByLabelText(/secondary/i))
    expect(virtualDeliveryToggle).toBeDisabled()
  })

  it('allows both blended learning and reaccreditation toggles to be selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />, {
        auth: {
          activeCertificates: [CourseLevel.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    const blendedLearningToggle = screen.getByLabelText(/blended learning/i)
    const reaccreditationToggle = screen.getByLabelText(/reaccreditation/i)

    expect(blendedLearningToggle).toBeDisabled()
    expect(reaccreditationToggle).toBeDisabled()

    await userEvent.click(screen.getByLabelText(/primary/i))

    expect(blendedLearningToggle).toBeEnabled()
    expect(reaccreditationToggle).toBeEnabled()
  })
})
