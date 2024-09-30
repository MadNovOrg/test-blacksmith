import { setMedia } from 'mock-match-media'
import { getI18n } from 'react-i18next'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { AwsRegions } from '@app/types'

import { act, render, screen, userEvent } from '@test/index'

import { CourseForm } from '..'
import { renderForm, selectLevel } from '../test-utils'

import { GeneralDetailsSection } from './GeneralDetailsSection'

const { t } = getI18n()

const levelOneInfoMessage = t(`components.course-form.course-level-one-info`)

const blendedLearningInfoMessage = t(
  `components.course-form.blended-learning-price-label`,
)

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

describe(`component: ${GeneralDetailsSection.name} UK`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })

  it('validates that end date must be after start date', async () => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

    renderForm(Course_Type_Enum.Open)

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
  })

  it('displays AOL checkbox for indirect course type', async () => {
    renderForm(Course_Type_Enum.Indirect)
    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.queryByTestId('aol-checkbox')).toBeInTheDocument()
  })

  it('renders correct organisation fields for indirect course type', async () => {
    renderForm(Course_Type_Enum.Indirect)

    expect(screen.getByTestId('org-selector')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-selector')).not.toBeInTheDocument()
  })

  it('shows an info alert for level 1 course', async () => {
    renderForm(Course_Type_Enum.Closed)

    const level = screen.getByTestId('course-level-select')
    expect(level.querySelector('input')).toHaveValue(Course_Level_Enum.Level_1)

    expect(screen.getByText(levelOneInfoMessage)).toBeInTheDocument()
  })

  it('hides the info alert for level 2 course', async () => {
    renderForm(Course_Type_Enum.Closed)
    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('hides the info alert for intermediate trainer course', async () => {
    renderForm(Course_Type_Enum.Closed)
    await selectLevel(Course_Level_Enum.IntermediateTrainer)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('hides the info alert for advanced trainer course', async () => {
    render(<CourseForm type={Course_Type_Enum.Closed} />, {
      auth: {
        activeCertificates: [Course_Level_Enum.AdvancedTrainer],
      },
    })

    await selectLevel(Course_Level_Enum.AdvancedTrainer)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('shows an info alert for blended learning for indirect courses', async () => {
    renderForm(Course_Type_Enum.Indirect)

    await userEvent.click(screen.getByLabelText('Blended learning'))

    expect(screen.getByText(blendedLearningInfoMessage)).toBeInTheDocument()
  })

  it("doesn't show course renewal cycle panel for an indirect course", async () => {
    renderForm(Course_Type_Enum.Indirect)

    expect(
      screen.queryByLabelText(/certificate duration/i),
    ).not.toBeInTheDocument()
  })

  it.each([
    [Course_Type_Enum.Open, Course_Level_Enum.Level_1],
    [Course_Type_Enum.Open, Course_Level_Enum.Level_2],
    [Course_Type_Enum.Closed, Course_Level_Enum.Level_1],
    [Course_Type_Enum.Closed, Course_Level_Enum.Level_2],
  ])(
    'shows course renewal panel for %s course type for %s and when course begins from 2024',
    async (type, courseLevel) => {
      setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

      render(<CourseForm type={type} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.AdvancedTrainer],
        },
      })

      act(() => {
        screen.getByLabelText('Start date', { exact: false }).focus()
      })

      await userEvent.paste('01/01/2024')
      await selectLevel(courseLevel)

      expect(screen.getByLabelText(/certificate duration/i)).toBeInTheDocument()
    },
  )

  it.each([[Course_Type_Enum.Open], [Course_Type_Enum.Closed]])(
    "doesn't show course renewal panel for %s course type and when course begins in 2023",
    async type => {
      setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

      render(<CourseForm type={type} />)

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

describe(`component: ${GeneralDetailsSection.name} Australia`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })

  beforeEach(() => {
    expect(import.meta.env.VITE_AWS_REGION).toBe(AwsRegions.Australia)
  })

  it('do not displays AOL checkbox for indirect course type', async () => {
    renderForm(Course_Type_Enum.Indirect)
    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.queryByTestId('aol-checkbox')).not.toBeInTheDocument()
  })
})
