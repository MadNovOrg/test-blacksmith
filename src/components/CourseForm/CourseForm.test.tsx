import { format } from 'date-fns'
import { setMedia } from 'mock-match-media'
import { getI18n } from 'react-i18next'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import {
  courseToCourseInput,
  INPUT_DATE_FORMAT,
  INPUT_TIME_FORMAT,
} from '@app/util'

import { act, render, screen, userEvent, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { renderForm, selectLevel } from './test-utils'

import CourseForm from '.'

const { t } = getI18n()

const levelOneInfoMessage = t(`components.course-form.course-level-one-info`)

const blendedLearningInfoMessage = t(
  `components.course-form.blended-learning-price-label`
)

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

const useCoursePriceMock = vi.mocked(useCoursePrice)

describe('component: CourseForm', () => {
  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      priceCurrency: 'GBP',
      priceAmount: 100,
    })
  })

  it('displays venue selector if F2F delivery type', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    await userEvent.click(screen.getByLabelText('Face to face'))

    expect(screen.getByText('Venue Selector')).toBeInTheDocument()
  })

  it('displays venue selector if VIRTUAL delivery type', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    await userEvent.click(screen.getByLabelText('Virtual'))

    expect(screen.queryByText('Venue Selector')).not.toBeInTheDocument()
  })

  it('displays venue selector if MIXED delivery type', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    await userEvent.click(screen.getByLabelText('Both'))

    expect(screen.getByText('Venue Selector')).toBeInTheDocument()
  })

  it('validates that end date must be after start date', async () => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Open} />)
    })

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
      screen.getByText('End date must be after the start date')
    ).toBeInTheDocument()
  })

  it('validates that min participants is smaller than max participants', async () => {
    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Open} />)
    })

    await waitFor(async () => {
      await userEvent.type(
        screen.getByLabelText('Minimum', { exact: false }),
        '6'
      )
      await userEvent.type(
        screen.getByLabelText('Maximum', { exact: false }),
        '5'
      )
    })

    expect(
      screen.getByText(
        'Minimum number of attendees must be less than the maximum number of attendees'
      )
    ).toBeInTheDocument()
  })

  it('validates that minimum participants has to be positive number', async () => {
    await waitFor(() => {
      render(<CourseForm type={Course_Type_Enum.Open} />)
    })

    await userEvent.type(
      screen.getByLabelText('Minimum', { exact: false }),
      '0'
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'Minimum number of attendees must be a positive number'
        )
      ).toBeInTheDocument()
    })
  })

  it('displays organisation selector and booking contact user selector if course type is closed', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    expect(screen.getByText('Org Selector')).toBeInTheDocument()
    expect(screen.getByTestId('user-selector')).toBeInTheDocument()
  })

  it('displays AOL checkbox for indirect course type', async () => {
    await waitFor(() => renderForm(Course_Type_Enum.Indirect))
    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.queryByTestId('aol-checkbox')).toBeInTheDocument()
  })

  it('renders correct organisation fields for indirect course type', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Indirect)
    })

    expect(screen.getByText('Org Selector')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-selector')).not.toBeInTheDocument()
  })

  it('does not render minimum participants for closed course type', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    expect(
      screen.queryByLabelText('Minimum', { exact: false })
    ).not.toBeInTheDocument()
  })

  it('does not render minimum participants for indirect course type', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Indirect)
    })

    expect(
      screen.queryByLabelText('Minimum', { exact: false })
    ).not.toBeInTheDocument()
  })

  it('displays course values if passed as prop', async () => {
    const type = Course_Type_Enum.Open
    const course = buildCourse({ overrides: { type } })
    const [schedule] = course.schedule

    await waitFor(() => {
      render(
        <CourseForm courseInput={courseToCourseInput(course)} type={type} />,
        {
          auth: {
            activeCertificates: [Course_Level_Enum.IntermediateTrainer],
          },
        }
      )
    })

    const level = screen.getByTestId('course-level-select')
    expect(level.querySelector('input')).toHaveValue(course.level)

    expect(screen.getByLabelText('Blended learning')).not.toBeChecked()
    expect(screen.getByLabelText('Reaccreditation')).not.toBeChecked()
    expect(screen.getByLabelText('Face to face')).toBeChecked()

    const startDate = format(new Date(schedule.start), INPUT_DATE_FORMAT)
    expect(screen.getByLabelText('Start date', { exact: false })).toHaveValue(
      startDate
    )

    const startTime = format(new Date(schedule.start), INPUT_TIME_FORMAT)
    expect(screen.getByLabelText('Start time', { exact: false })).toHaveValue(
      startTime
    )

    const min = screen.getByTestId('min-attendees').querySelector('input')
    expect(min).toHaveValue(course.min_participants)

    const max = screen.getByTestId('max-attendees').querySelector('input')
    expect(max).toHaveValue(course.max_participants)
  })

  it('calculates account code based on start date', async () => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    act(() => {
      screen.getByLabelText('Start date', { exact: false }).focus()
    })

    await userEvent.paste('12/05/2022')

    act(() => {
      screen.getByLabelText('Start time', { exact: false }).focus()
    })

    await userEvent.paste('09:00 AM')

    await waitFor(() => {
      expect(screen.getByText('810A May22')).toBeInTheDocument()
    })
  })

  it('shows an info alert for level 1 course', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    const level = screen.getByTestId('course-level-select')
    expect(level.querySelector('input')).toHaveValue(Course_Level_Enum.Level_1)

    await waitFor(() => {
      expect(screen.getByText(levelOneInfoMessage)).toBeInTheDocument()
    })
  })

  it('hides the info alert for level 2 course', async () => {
    await waitFor(() => renderForm(Course_Type_Enum.Closed))
    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('hides the info alert for intermediate trainer course', async () => {
    await waitFor(() => renderForm(Course_Type_Enum.Closed))
    await selectLevel(Course_Level_Enum.IntermediateTrainer)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('hides the info alert for advanced trainer course', async () => {
    await waitFor(() =>
      render(<CourseForm type={Course_Type_Enum.Closed} />, {
        auth: {
          activeCertificates: [Course_Level_Enum.AdvancedTrainer],
        },
      })
    )
    await selectLevel(Course_Level_Enum.AdvancedTrainer)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('shows an info alert for blended learning for indirect courses', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Indirect)
    })

    await userEvent.click(screen.getByLabelText('Blended learning'))

    await waitFor(() => {
      expect(screen.getByText(blendedLearningInfoMessage)).toBeInTheDocument()
    })
  })

  it("doesn't show course renewal cycle panel for an indirect course", async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Indirect)
    })

    expect(
      screen.queryByLabelText(/certificate duration/i)
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

      await waitFor(() => {
        render(<CourseForm type={type} />, {
          auth: {
            activeCertificates: [Course_Level_Enum.AdvancedTrainer],
          },
        })
      })

      act(() => {
        screen.getByLabelText('Start date', { exact: false }).focus()
      })

      await userEvent.paste('01/01/2024')
      await selectLevel(courseLevel)

      expect(screen.getByLabelText(/certificate duration/i)).toBeInTheDocument()
    }
  )

  it.each([[Course_Type_Enum.Open], [Course_Type_Enum.Closed]])(
    "doesn't show course renewal panel for %s course type and when course begins in 2023",
    async type => {
      setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

      await waitFor(() => {
        render(<CourseForm type={type} />)
      })

      act(() => {
        screen.getByLabelText('Start date', { exact: false }).focus()
      })

      await userEvent.paste('31/12/2023')

      expect(
        screen.queryByLabelText(/certificate duration/i)
      ).not.toBeInTheDocument()
    }
  )
})
