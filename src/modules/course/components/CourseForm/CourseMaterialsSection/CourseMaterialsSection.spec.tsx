import { renderHook } from '@testing-library/react'
import { useFeatureFlagEnabled } from 'posthog-js/react'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RoleName } from '@app/types'

import { screen, userEvent } from '@test/index'

import { renderForm } from '../test-utils'

import { CourseMaterialsSection } from './CourseMaterialsSection'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockResolvedValue(true),
}))

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

describe(`component: ${CourseMaterialsSection.name}`, () => {
  beforeEach(() => {
    useFeatureFlagEnabled('mandatory-course-materials-cost')
  })
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation('components.course-form.mandatory-course-materials')
  )

  it('renders mandatory course materials component', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN
    )
    expect(screen.getByTestId('mandatory-course-materials')).toBeInTheDocument()
  })

  it('validates mandatory course materials is required', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN
    )
    const mcm = screen.getByTestId('mandatory-course-materials')
    await userEvent.type(mcm, '1')
    await userEvent.clear(screen.getByLabelText('Materials', { exact: false }))
    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(screen.queryByText(t('errors.is-required'))).toBeInTheDocument()
  })

  it('validates mandatory course materials should be a positive number', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN
    )
    expect(
      screen.getByLabelText('Materials', { exact: false })
    ).toBeInTheDocument()
    await userEvent.type(
      screen.getByLabelText('Materials', { exact: false }),
      '-1'
    )
    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(screen.queryByText(t('errors.is-negative'))).toBeInTheDocument()
  })

  it('validates mandatory course materials should be less than max attendees', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN
    )

    await userEvent.type(
      screen.getByLabelText('Materials', { exact: false }),
      '6'
    )

    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(
      screen.queryByText(t('errors.more-mcm-than-attendees-create'))
    ).toBeInTheDocument()
  })

  it('free course materials amount is displayed correctly', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN
    )
    const maxAttendees = 5
    const mandatoryCourseMaterials = 2

    await userEvent.type(
      screen.getByLabelText('Number of attendees', { exact: false }),
      maxAttendees.toString()
    )
    await userEvent.type(
      screen.getByLabelText('Materials', { exact: false }),
      mandatoryCourseMaterials.toString()
    )
    expect(screen.getByTestId('free-course-materials').textContent).toEqual(
      t('amount-of-free-mcm', {
        count: maxAttendees - mandatoryCourseMaterials,
      })
    )
  })
})
