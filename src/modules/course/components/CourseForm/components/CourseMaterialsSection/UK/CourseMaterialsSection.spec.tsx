import { renderHook, waitFor, within } from '@testing-library/react'

import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { CourseForm } from '@app/modules/course/components/CourseForm'
import { renderForm } from '@app/modules/course/components/CourseForm/test-utils'
import { AwsRegions, RoleName } from '@app/types'
import { CurrencySymbol, MCMAmount, VAT, courseToCourseInput } from '@app/util'

import { render, screen, userEvent } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseMaterialsSection } from './CourseMaterialsSection'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockResolvedValue(true),
}))

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

describe(`component: ${CourseMaterialsSection.name}`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation('components.course-form.free-course-materials'),
  )

  it('renders mandatory course materials component %s', () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.AdvancedTrainer,
      role: RoleName.TT_ADMIN,
    })
    expect(screen.getByTestId('mandatory-course-materials')).toBeInTheDocument()
  })

  it('validates mandatory course materials is required eu-west-2', async () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.AdvancedTrainer,
      role: RoleName.TT_ADMIN,
    })
    const mcm = screen.getByTestId('mandatory-course-materials')
    await userEvent.type(mcm, '1')
    await userEvent.clear(screen.getByLabelText('Materials', { exact: false }))
    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(screen.queryByText(t('errors.is-required'))).toBeInTheDocument()
  })

  it('validates mandatory course materials should be a positive number', async () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.AdvancedTrainer,
      role: RoleName.TT_ADMIN,
    })
    expect(
      screen.getByLabelText('Materials', { exact: false }),
    ).toBeInTheDocument()
    await userEvent.type(
      screen.getByLabelText('Materials', { exact: false }),
      '-1',
    )
    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(screen.queryByText(t('errors.is-negative'))).toBeInTheDocument()
  })

  it('validates mandatory course materials should be less than max attendees', async () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.AdvancedTrainer,
      role: RoleName.TT_ADMIN,
    })

    await userEvent.type(
      screen.getByLabelText('Materials', { exact: false }),
      '6',
    )

    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(
      screen.queryByText(t('errors.more-fcm-than-attendees-create')),
    ).toBeInTheDocument()
  })

  it.each(Object.entries(MCMAmount))(
    'displays MCM cost info with %s currency in UK region',
    async (currency, amount) => {
      vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
      const type = Course_Type_Enum.Closed
      const course = buildCourse({
        overrides: {
          accreditedBy: Accreditors_Enum.Icm,
          type,
          priceCurrency: currency,
          free_course_materials: 2,
          includeVAT: true,
        },
      })
      await waitFor(() =>
        render(
          <CourseForm courseInput={courseToCourseInput(course)} type={type} />,
          {
            auth: {
              activeRole: RoleName.TT_ADMIN,
            },
          },
        ),
      )

      const countriesSelector = screen.getByTestId(
        'countries-selector-autocomplete',
      )
      expect(countriesSelector).toBeInTheDocument()
      countriesSelector.focus()

      const textField = within(countriesSelector).getByTestId(
        'countries-selector-input',
      )
      expect(textField).toBeInTheDocument()

      await userEvent.type(textField, 'Romania')

      const countryOutOfUKs = screen.getByTestId('country-RO')
      expect(countryOutOfUKs).toBeInTheDocument()

      await userEvent.click(countryOutOfUKs)

      expect(
        screen.getByText(
          t('panel-description', {
            mcmAmount: `${CurrencySymbol[currency as Currency]}${amount}`,
            VAT: VAT,
          }),
        ),
      ).toBeInTheDocument()
    },
  )
})
