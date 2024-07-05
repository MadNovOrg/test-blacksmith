import { renderHook, waitFor, within } from '@testing-library/react'
import { useFeatureFlagEnabled } from 'posthog-js/react'

import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RoleName } from '@app/types'
import { VAT, courseToCourseInput } from '@app/util'

import { render, screen, userEvent } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseForm } from '..'
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
    useScopedTranslation('components.course-form.mandatory-course-materials'),
  )

  it('renders mandatory course materials component', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN,
    )
    expect(screen.getByTestId('mandatory-course-materials')).toBeInTheDocument()
  })

  it('validates mandatory course materials is required', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN,
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
      RoleName.TT_ADMIN,
    )
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
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN,
    )

    await userEvent.type(
      screen.getByLabelText('Materials', { exact: false }),
      '6',
    )

    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(
      screen.queryByText(t('errors.more-mcm-than-attendees-create')),
    ).toBeInTheDocument()
  })

  it('free course materials amount is displayed correctly', async () => {
    renderForm(
      Course_Type_Enum.Closed,
      Course_Level_Enum.AdvancedTrainer,
      RoleName.TT_ADMIN,
    )
    const maxAttendees = 5
    const mandatoryCourseMaterials = 2

    await userEvent.type(
      screen.getByLabelText('Number of attendees', { exact: false }),
      maxAttendees.toString(),
    )
    await userEvent.type(
      screen.getByLabelText('Materials', { exact: false }),
      mandatoryCourseMaterials.toString(),
    )
    expect(screen.getByTestId('free-course-materials').textContent).toEqual(
      t('amount-of-free-mcm', {
        count: maxAttendees - mandatoryCourseMaterials,
      }),
    )
  })

  it('displays MCM cost info with GBP currency', async () => {
    const type = Course_Type_Enum.Closed
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type,
        priceCurrency: Currency.Gbp,
        mandatory_course_materials: 2,
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
          mcmAmount: '£10',
          VAT: VAT,
        }),
      ),
    ).toBeInTheDocument()
  })

  it('displays MCM cost info with EURO currency', async () => {
    const type = Course_Type_Enum.Closed
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type,
        priceCurrency: Currency.Eur,
        mandatory_course_materials: 2,
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
          mcmAmount: '€12',
          VAT: VAT,
        }),
      ),
    ).toBeInTheDocument()
  })

  it('displays MCM cost info with USD currency', async () => {
    const type = Course_Type_Enum.Closed
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type,
        priceCurrency: Currency.Usd,
        mandatory_course_materials: 2,
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
          mcmAmount: '$13',
          VAT: VAT,
        }),
      ),
    ).toBeInTheDocument()
  })

  it('displays MCM cost info with NZD$ currency', async () => {
    const type = Course_Type_Enum.Closed
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type,
        priceCurrency: Currency.Nzd,
        mandatory_course_materials: 2,
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
          mcmAmount: 'NZD$20',
          VAT: VAT,
        }),
      ),
    ).toBeInTheDocument()
  })

  it('displays MCM cost info with AUD$ currency', async () => {
    const type = Course_Type_Enum.Closed
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type,
        priceCurrency: Currency.Aud,
        mandatory_course_materials: 2,
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
          mcmAmount: 'AUD$20',
          VAT: VAT,
        }),
      ),
    ).toBeInTheDocument()
  })
})
