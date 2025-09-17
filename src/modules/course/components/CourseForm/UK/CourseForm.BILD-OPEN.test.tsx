import { t } from 'i18next'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { AwsRegions, RoleName } from '@app/types'

import { _render, screen, userEvent, waitFor } from '@test/index'

import { renderForm, selectBildCategory, selectLevel } from '../test-utils'

import { UkCourseForm } from '.'

vi.mock('@app/components/OrgSelector/UK', () => ({
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

describe('UkCourseForm - open BILD', () => {
  vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      priceCurrency: 'GBP',
      priceAmount: 100,
    })
  })
  ;[RoleName.TT_ADMIN, RoleName.SALES_ADMIN, RoleName.TT_OPS].forEach(role => {
    it(`allows ${role} to create open BILD course`, async () => {
      await waitFor(() => {
        _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
          auth: { activeRole: role },
        })
      })

      expect(screen.getByLabelText(/course category/i)).toBeInTheDocument()
    })
  })

  it('displays BILD Intermediate Trainer and BILD Advanced trainer course levels', async () => {
    await waitFor(() => {
      _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await userEvent.click(screen.getByLabelText(/course level/i))

    expect(
      screen.getByTestId(
        `course-level-option-${Course_Level_Enum.BildAdvancedTrainer}`,
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(
        `course-level-option-${Course_Level_Enum.BildIntermediateTrainer}`,
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(
        `course-level-option-${Course_Level_Enum.BildRegular}`,
      ),
    ).not.toBeInTheDocument()
  })

  it('allows face to face and mixed delivery types if BILD Intermediate trainer course', async () => {
    await waitFor(() => {
      _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(Course_Level_Enum.BildIntermediateTrainer)

    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeEnabled()
    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
  })

  it('allows only face to face delivery type if BILD Advanced trainer course', async () => {
    await waitFor(() => {
      _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await selectLevel(Course_Level_Enum.BildAdvancedTrainer)

    expect(screen.getByLabelText(/face to face/i)).toBeEnabled()
    expect(screen.getByLabelText(/both/i)).toBeDisabled()
    expect(screen.getByLabelText(/virtual/i)).toBeDisabled()
  })

  it("doesn't allow blended learning on open BILD courses", async () => {
    await waitFor(() => {
      _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(screen.getByLabelText(/blended learning/i)).toBeDisabled()
  })

  it("disables reaccreditation if it's a conversion open BILD course", async () => {
    await waitFor(() => {
      _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await userEvent.click(screen.getByLabelText(/conversion course/i))

    expect(screen.getByLabelText(/reaccreditation/i)).toBeDisabled()
  })

  it("disables conversion if it's a reaccreditation course", async () => {
    await waitFor(() => {
      _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()
    await userEvent.click(screen.getByLabelText(/reaccreditation/i))

    expect(screen.getByLabelText(/conversion course/i)).toBeDisabled()
  })

  it('displays price field for open BILD course', async () => {
    await waitFor(() => {
      _render(<UkCourseForm type={Course_Type_Enum.Open} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })
    })

    await selectBildCategory()

    expect(
      screen.getByPlaceholderText(/price per attendee/i),
    ).toBeInTheDocument()
  })

  // https://behaviourhub.atlassian.net/browse/TTHP-3613
  it.each([
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ])(
    'enables Virtual and Mixed delivery for %s when conversion course is selected',
    async level => {
      await waitFor(() => {
        _render(<UkCourseForm type={Course_Type_Enum.Closed} />, {
          auth: { activeRole: RoleName.TT_ADMIN },
        })
      })

      await selectBildCategory()
      await selectLevel(level)

      await userEvent.click(screen.getByLabelText(/conversion course/i))
      expect(screen.getByLabelText(/conversion course/i)).toBeChecked()

      expect(screen.getByLabelText(/virtual/i)).toBeEnabled()
      expect(screen.getByLabelText(/both/i)).toBeEnabled()
    },
  )

  it("doesn't allow changing residing country", async () => {
    renderForm({ type: Course_Type_Enum.Closed, role: RoleName.TT_ADMIN })
    await selectBildCategory()

    expect(
      screen.queryByLabelText(t('components.course-form.residing-country')),
    ).not.toBeInTheDocument()
  })
})
