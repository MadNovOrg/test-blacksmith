import { setMedia } from 'mock-match-media'
import { getI18n } from 'react-i18next'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { AwsRegions } from '@app/types'

import { act, screen, userEvent, waitFor } from '@test/index'

import { renderForm, selectLevel } from '../../test-utils'

import { GeneralDetailsSection } from './GeneralDetailsSection'

const { t } = getI18n()

const levelOneInfoMessage = t(`components.course-form.course-level-one-info`)

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

describe(`component: ${GeneralDetailsSection.name}`, () => {
  afterEach(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  it.each(Object.values(AwsRegions))(
    'validates that end date must be after start date',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

      renderForm({ type: Course_Type_Enum.Open })

      act(() => {
        screen.getByLabelText('Start date', { exact: false }).focus()
      })

      await userEvent.paste('12/05/2022')

      act(() => {
        screen.getByLabelText('Start time', { exact: false }).focus()
      })
      await userEvent.paste('09:00 AM')

      act(() => {
        screen.getByLabelText('End date', { exact: false }).focus()
      })
      await userEvent.paste('12/04/2022')

      act(() => {
        screen.getByLabelText('End time', { exact: false }).focus()
      })
      await userEvent.paste('08:00 AM')

      expect(
        screen.getByText('End date must be after the start date'),
      ).toBeInTheDocument()
    },
  )

  it('displays AOL checkbox for indirect course type', async () => {
    renderForm({ type: Course_Type_Enum.Indirect })
    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.queryByTestId('aol-checkbox')).toBeInTheDocument()
  })

  it.each(Object.values(AwsRegions))(
    'renders correct organisation fields for indirect course type %s',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      await waitFor(() => renderForm({ type: Course_Type_Enum.Indirect }))

      expect(screen.getByTestId('org-selector')).toBeInTheDocument()
      expect(screen.queryByTestId('profile-selector')).not.toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'shows an info alert for level 1 course',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Closed })

      const level = screen.getByTestId('course-level-select')
      expect(level.querySelector('input')).toHaveValue(
        Course_Level_Enum.Level_1,
      )

      expect(screen.getByText(levelOneInfoMessage)).toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'hides the info alert for level 2 course',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Closed })
      await selectLevel(Course_Level_Enum.Level_2)

      expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'hides the info alert for intermediate trainer course',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Closed })
      await selectLevel(Course_Level_Enum.IntermediateTrainer)

      expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
    },
  )

  it('hides the info alert for advanced trainer course [UK]', async () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.AdvancedTrainer,
    })
    await selectLevel(Course_Level_Enum.AdvancedTrainer)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it.each(Object.values(AwsRegions))(
    "doesn't show course renewal cycle panel for an indirect course",
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Indirect })

      expect(
        screen.queryByLabelText(/certificate duration/i),
      ).not.toBeInTheDocument()
    },
  )

  it.each([
    [Course_Type_Enum.Open, Course_Level_Enum.Level_1, AwsRegions.UK],
    [Course_Type_Enum.Open, Course_Level_Enum.Level_1, AwsRegions.Australia],
    [Course_Type_Enum.Open, Course_Level_Enum.Level_2, AwsRegions.UK],
    [Course_Type_Enum.Open, Course_Level_Enum.Level_2, AwsRegions.Australia],
    [Course_Type_Enum.Closed, Course_Level_Enum.Level_1, AwsRegions.UK],
    [Course_Type_Enum.Closed, Course_Level_Enum.Level_1, AwsRegions.Australia],
    [Course_Type_Enum.Closed, Course_Level_Enum.Level_2, AwsRegions.UK],
    [Course_Type_Enum.Closed, Course_Level_Enum.Level_2, AwsRegions.Australia],
  ])(
    'shows course renewal panel for %s course type for %s and when course begins from 2024',
    async (type, courseLevel, appRegion) => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({
        type,
        certificateLevel: Course_Level_Enum.AdvancedTrainer,
      })

      act(() => {
        screen.getByLabelText('Start date', { exact: false }).focus()
      })

      await userEvent.paste('01/01/2024')
      await selectLevel(courseLevel)

      expect(screen.getByLabelText(/certificate duration/i)).toBeInTheDocument()
    },
  )

  it.each([
    [Course_Type_Enum.Open, AwsRegions.UK],
    [Course_Type_Enum.Open, AwsRegions.Australia],
    [Course_Type_Enum.Closed, AwsRegions.UK],
    [Course_Type_Enum.Closed, AwsRegions.Australia],
    // Add other regions as needed
  ])(
    "doesn't show course renewal panel for %s course type in %s region and when course begins in 2023",
    async (courseType, appRegion) => {
      setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: courseType })

      act(() => {
        screen.getByLabelText('Start date', { exact: false }).focus()
      })

      await userEvent.paste('31/12/2023')

      expect(
        screen.queryByLabelText(/certificate duration/i),
      ).not.toBeInTheDocument()
    },
  )
})
