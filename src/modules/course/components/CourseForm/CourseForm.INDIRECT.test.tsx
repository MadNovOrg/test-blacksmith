import { t } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { RoleName } from '@app/types'

import { screen, userEvent, waitFor, within } from '@test/index'

import { renderForm, selectDelivery, selectLevel } from './test-utils'

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))

const useCoursePriceMock = vi.mocked(useCoursePrice)
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe('component: CourseForm - INDIRECT', () => {
  const type = Course_Type_Enum.Indirect

  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      priceCurrency: 'GBP',
      priceAmount: 100,
    })
  })

  // Delivery
  it('allows INDIRECT+LEVEL_1 to be F2F, VIRTUAL or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts INDIRECT+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts INDIRECT+ADVANCED to be F2F', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.Advanced)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows INDIRECT+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts INDIRECT+LEVEL_1+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts INDIRECT+LEVEL_2+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts INDIRECT+ADVANCED+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.Advanced)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows INDIRECT+LEVEL_1+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+MIXED to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+VIRTUAL to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_2+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_2+MIXED to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  describe('Level 1 Behaviour Support', () => {
    it("doesn't show Level 1 Behaviour Support with the feature flag disabled", async () => {
      useFeatureFlagEnabledMock.mockReturnValue(false)

      renderForm(type)

      const select = screen.getByTestId('course-level-select')
      await userEvent.click(within(select).getByRole('button'))
      const levels = screen.getAllByRole('option')
      const text = 'Level One Behaviour Support'
      expect(levels.some(level => level.textContent === text)).toBe(false)
    })

    it('shows Level 1 Behaviour Support with the feature flag enabled', async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      renderForm(type)

      const select = screen.getByTestId('course-level-select')
      await userEvent.click(within(select).getByRole('button'))
      const levels = screen.getAllByRole('option')
      const text = 'Level One Behaviour Support'
      expect(levels.some(level => level.textContent === text)).toBe(true)
    })

    it.each([
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.BildIntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.BildAdvancedTrainer,
      Course_Level_Enum.FoundationTrainerPlus,
    ])(
      'shows Level 1 Behaviour Support for trainers with %s certificate',
      async level => {
        useFeatureFlagEnabledMock.mockReturnValue(true)

        renderForm(type, level)

        const select = screen.getByTestId('course-level-select')
        await userEvent.click(within(select).getByRole('button'))
        const levels = screen.getAllByRole('option')
        const text = 'Level One Behaviour Support'
        expect(levels.some(level => level.textContent === text)).toBe(true)
      }
    )

    it('allows re-accreditation to be selected', async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      renderForm(type)

      await selectLevel(Course_Level_Enum.Level_1Bs)

      const reacc = screen.getByLabelText('Reaccreditation')
      expect(reacc).toBeEnabled()
      await userEvent.click(reacc)
      expect(reacc).toBeChecked()
    })

    it('allows Face to face and Mixed delivery type, but not Virtual', async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      renderForm(type)

      await selectLevel(Course_Level_Enum.Level_1Bs)

      expect(screen.getByLabelText('Face to face')).toBeEnabled()
      expect(screen.getByLabelText('Virtual')).toBeDisabled()
      expect(screen.getByLabelText('Both')).toBeEnabled()
    })

    it('preselects course residing country to England if an internal role creates the course', async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)

      await selectLevel(Course_Level_Enum.Level_1Bs)

      const country = screen.getByLabelText('Course Residing Country')
      expect(country).toHaveValue('England')
    })

    it("preselects course residing country to trainer's country if they have the trainer role selected", async () => {
      useFeatureFlagEnabledMock.mockReturnValue(true)

      renderForm(
        type,
        Course_Level_Enum.IntermediateTrainer,
        RoleName.TRAINER,
        {
          countryCode: 'MD',
        }
      )

      await selectLevel(Course_Level_Enum.Level_1Bs)

      const country = screen.getByLabelText('Course Residing Country')
      expect(country).toHaveValue('Moldova, Republic of')
    })
  })

  it('allows changing the residing country', async () => {
    useFeatureFlagEnabledMock.mockImplementation(
      (flag: string) =>
        flag === 'course-residing-country' || flag === 'international-indirect'
    )
    renderForm(type)

    expect(
      screen.getByLabelText(t('components.course-form.residing-country'))
    ).toBeInTheDocument()
  })
})
