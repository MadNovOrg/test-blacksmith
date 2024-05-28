import { t } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { RoleName } from '@app/types'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { renderForm, selectBildCategory, selectLevel } from './test-utils'

import { CourseForm } from '.'

vi.mock('@app/components/OrgSelector', () => ({
  OrgSelector: vi.fn(() => <p>Org Selector</p>),
}))

vi.mock('@app/components/VenueSelector', () => ({
  VenueSelector: vi.fn(() => <p>Venue Selector</p>),
}))

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))

const useCoursePriceMock = vi.mocked(useCoursePrice)
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe('CourseForm - indirect BILD', () => {
  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      priceCurrency: 'GBP',
      priceAmount: 100,
    })
  })
  ;[RoleName.TT_ADMIN, RoleName.TT_OPS].forEach(role => {
    it(`allows ${role} to create a BILD course`, async () => {
      await waitFor(() => {
        render(<CourseForm type={Course_Type_Enum.Indirect} />, {
          auth: {
            activeCertificates: [Course_Level_Enum.BildIntermediateTrainer],
            activeRole: role,
          },
        })
      })

      await userEvent.click(screen.getByLabelText(/course category/i))

      expect(
        within(screen.getByRole('listbox')).getByText(/bild/i)
      ).toBeInTheDocument()
    })
  })

  it('allows a trainer with a BILD Intermediate trainer certificate to create a BILD course', async () => {
    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildIntermediateTrainer],
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
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
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
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
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
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildIntermediateTrainer],
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
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    expect(
      screen.getByLabelText(/restrictive tertiary advanced/i)
    ).toBeEnabled()
  })

  it('enables Blended learning toggle if Primary strategy is selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()

    const blendedLearningToggle = screen.getByLabelText(/blended learning/i)

    await userEvent.click(screen.getByLabelText(/primary/i))
    expect(blendedLearningToggle).toBeEnabled()

    await userEvent.click(screen.getByLabelText(/secondary/i))
    expect(blendedLearningToggle).toBeEnabled()

    await userEvent.click(screen.getByLabelText(/primary/i))
    expect(blendedLearningToggle).toBeDisabled()
  })

  it('enables Virtual delivery type if Primary srategy is the only one selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
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
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
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
    await userEvent.click(screen.getByLabelText(/secondary/i))

    expect(blendedLearningToggle).toBeEnabled()
    expect(reaccreditationToggle).toBeEnabled()
  })

  it('allows mixed delivery only if primary strategy is selected', async () => {
    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()
    await selectLevel(Course_Level_Enum.BildRegular)

    const mixedDeliveryToggle = screen.getByLabelText(/both/i)

    expect(mixedDeliveryToggle).toBeDisabled()

    await userEvent.click(screen.getByLabelText(/primary/i))

    expect(mixedDeliveryToggle).toBeEnabled()
  })

  it("doesn't show AOL checkbox", async () => {
    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Indirect} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.BildAdvancedTrainer],
          activeRole: RoleName.TRAINER,
        },
      })
    })

    await selectBildCategory()
    await selectLevel(Course_Level_Enum.BildRegular)

    expect(screen.queryByTestId('aol-checkbox')).not.toBeInTheDocument()
  })

  it("doesn't allow changing residing country", async () => {
    useFeatureFlagEnabledMock.mockImplementation(
      (flag: string) => flag === 'course-residing-country'
    )
    renderForm(Course_Type_Enum.Closed)
    await selectBildCategory()

    expect(
      screen.queryByLabelText(t('components.course-form.residing-country'))
    ).not.toBeInTheDocument()
  })
})
