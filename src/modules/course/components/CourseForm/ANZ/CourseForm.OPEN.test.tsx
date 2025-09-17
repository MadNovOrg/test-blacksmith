import posthog from 'posthog-js'
import { useTranslation } from 'react-i18next'

import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import { AwsRegions, RoleName } from '@app/types'
import { courseToCourseInput } from '@app/util'

import {
  _render,
  renderHook,
  screen,
  userEvent,
  waitFor,
  within,
} from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { renderForm, selectLevel, selectDelivery } from '../test-utils'

import { AnzCourseForm } from '.'

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))
vi.mock('posthog-js/react')
const useCoursePriceMock = vi.mocked(useCoursePrice)

describe('component: AnzCourseForm - OPEN', () => {
  vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  vi.spyOn(posthog, 'getFeatureFlag').mockReturnValue(true)
  const type = Course_Type_Enum.Open
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      priceCurrency: 'AUD',
      priceAmount: 100,
    })
  })

  // Delivery
  it('restricts OPEN+LEVEL_1 to be F2F or VIRTUAL', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts OPEN+INTERMEDIATE_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts OPEN+FOUNDATION_TRAINER to be MIXED or VIRTUAL', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.FoundationTrainer)

    expect(screen.getByLabelText('Face to face')).toBeDisabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts OPEN+Foundation Trainer to be F2F', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.FoundationTrainer)

    expect(screen.getByLabelText('Face to face')).toBeDisabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  // Blended
  it('restricts OPEN+LEVEL_1+F2F to Non-blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts OPEN+LEVEL_1+VIRTUAL to Non-blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts OPEN+INTERMEDIATE_TRAINER+F2F to Non-blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts OPEN+FoundationTrainer to Non-blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.FoundationTrainer)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('restricts OPEN+LEVEL_1+F2F to New Certificate', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('restricts OPEN+LEVEL_1+VIRTUAL to New Certificate', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('allows OPEN+INTERMEDIATE_TRAINER+F2F to New Certificate and Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeEnabled()
    expect(reacc).not.toBeChecked()

    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows OPEN+FoundationTrainer+Mixed to New Certificate and Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.FoundationTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeEnabled()
    expect(reacc).not.toBeChecked()

    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows OPEN+FoundationTrainer+Virtual to New Certificate and Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.FoundationTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeEnabled()
    expect(reacc).not.toBeChecked()

    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows OPEN+FOUNDATION_TRAINER+MIXED to Reaccreditation', async () => {
    await waitFor(() =>
      renderForm({
        type,
      }),
    )

    await selectLevel(Course_Level_Enum.FoundationTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeEnabled()

    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows OPEN+FOUNDATION_TRAINER+VIRTUAL to Reaccreditation', async () => {
    await waitFor(() =>
      renderForm({
        type,
      }),
    )

    await selectLevel(Course_Level_Enum.FoundationTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('requires price for an international OPEN course accredited by ICM and with enabled flag', async () => {
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        type,
      },
    })
    await waitFor(() =>
      _render(
        <AnzCourseForm courseInput={courseToCourseInput(course)} type={type} />,
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

    await userEvent.type(textField, 'Fiji')

    const countryOutOfUKs = screen.getByTestId('country-FJ')
    expect(countryOutOfUKs).toBeInTheDocument()

    await userEvent.click(countryOutOfUKs)

    const financeSection = screen.getByText(
      t('components.course-form.finance-section-title'),
    )
    expect(financeSection).toBeInTheDocument()
  })

  it('does not display Finance section on create course when residing country is Australia', async () => {
    const course = buildCourse({
      overrides: {
        accreditedBy: Accreditors_Enum.Icm,
        residingCountry: 'AU',
        type,
      },
    })
    await waitFor(() =>
      _render(
        <AnzCourseForm
          courseInput={courseToCourseInput(course)}
          type={type}
          isCreation={true}
        />,
        {
          auth: {
            activeRole: RoleName.TT_ADMIN,
          },
        },
      ),
    )

    const financeSectionTitle = screen.queryByText('Finance')
    expect(financeSectionTitle).toBe(null)
  })
})
