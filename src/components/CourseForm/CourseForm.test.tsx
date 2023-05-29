import { format } from 'date-fns'
import { setMedia } from 'mock-match-media'
import React from 'react'
import { getI18n } from 'react-i18next'

import { CourseType, CourseLevel } from '@app/types'
import {
  courseToCourseInput,
  INPUT_DATE_FORMAT,
  INPUT_TIME_FORMAT,
} from '@app/util'

import { act, render, screen, userEvent, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { ZOOM_MOCKED_URL, selectLevel } from './test-utils'

import CourseForm from '.'

const { t } = getI18n()

const levelOneInfoMessage = t(`components.course-form.course-level-one-info`)

const blendedLearningInfoMessage = t(
  `components.course-form.blended-learning-price-label`
)

describe('component: CourseForm', () => {
  it('displays venue selector if F2F delivery type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    await userEvent.click(screen.getByLabelText('Face to face'))

    expect(screen.getByText('Venue Selector')).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Online meeting link')
    ).not.toBeInTheDocument()
  })

  it('displays online meeting link field if VIRTUAL delivery type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    await userEvent.click(screen.getByLabelText('Virtual'))

    expect(screen.queryByText('Venue Selector')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Online meeting link')).toBeInTheDocument()
  })

  it('displays venue selector and online meeting link field if MIXED delivery type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    await userEvent.click(screen.getByLabelText('Both'))

    expect(screen.getByText('Venue Selector')).toBeInTheDocument()
    expect(screen.getByLabelText('Online meeting link')).toBeInTheDocument()
  })

  it.each([
    // Format: [<CourseType>, <ShouldGenerateLink?>]
    [CourseType.OPEN, true],
    [CourseType.CLOSED, true],
    [CourseType.INDIRECT, false],
  ])(
    'ONLY auto fills online meeting link field for OPEN and CLOSED course types',
    async (type, result) => {
      await waitFor(() => {
        render(<CourseForm type={type} />)
      })

      await userEvent.click(screen.getByLabelText('Virtual'))

      let input
      try {
        input = await screen.findByDisplayValue<HTMLInputElement>(
          ZOOM_MOCKED_URL,
          {},
          { timeout: 3000 }
        )
      } catch (_) {
        input = null
      }

      if (result) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(input).toBeInTheDocument()
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(input).toBe(null)
      }
    }
  )

  it('validates that end date must be after start date', async () => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

    act(() => {
      screen.getByLabelText('Start date').focus()
    })

    await userEvent.paste('12/05/2022')

    act(() => {
      screen.getByLabelText('Start time').focus()
    })
    await userEvent.paste('09:00 AM')

    act(() => {
      screen.getByLabelText('End date').focus()
    })
    await userEvent.paste('12/04/2022')

    act(() => {
      screen.getByLabelText('End time').focus()
    })
    await userEvent.paste('08:00 AM')

    expect(
      screen.getByText('End date must be after the start date')
    ).toBeInTheDocument()
  })

  it('validates that min participants is smaller than max participants', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

    await waitFor(async () => {
      await userEvent.type(screen.getByLabelText('Minimum'), '6')
      await userEvent.type(screen.getByLabelText('Maximum'), '5')
    })

    expect(
      screen.getByText(
        'Minimum number of attendees must be less than the maximum number of attendees'
      )
    ).toBeInTheDocument()
  })

  it('validates that minimum participants has to be positive number', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.OPEN} />)
    })

    await userEvent.type(screen.getByLabelText('Minimum'), '0')

    await waitFor(() => {
      expect(
        screen.getByText('Minimum participants must be positive number')
      ).toBeInTheDocument()
    })
  })

  it('displays organisation selector and contact profile selector if course type is closed', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    expect(screen.getByText('Org Selector')).toBeInTheDocument()
    expect(screen.getByTestId('profile-selector')).toBeInTheDocument()
  })

  it('renders correct organisation fields for indirect course type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />)
    })

    expect(screen.getByText('Org Selector')).toBeInTheDocument()
    expect(screen.queryByTestId('profile-selector')).not.toBeInTheDocument()
  })

  it('does not render minimum participants for closed course type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    expect(screen.queryByLabelText('Minimum')).not.toBeInTheDocument()
  })

  it('does not render minimum participants for indirect course type', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />)
    })

    expect(screen.queryByLabelText('Minimum')).not.toBeInTheDocument()
  })

  it('displays course values if passed as prop', async () => {
    const type = CourseType.OPEN
    const course = buildCourse({ overrides: { type } })
    const [schedule] = course.schedule

    await waitFor(() => {
      render(
        <CourseForm courseInput={courseToCourseInput(course)} type={type} />
      )
    })

    const level = screen.getByTestId('course-level-select')
    expect(level.querySelector('input')).toHaveValue(course.level)

    expect(screen.getByLabelText('Blended learning')).not.toBeChecked()
    expect(screen.getByLabelText('Reaccreditation')).not.toBeChecked()
    expect(screen.getByLabelText('Face to face')).toBeChecked()

    const startDate = format(new Date(schedule.start), INPUT_DATE_FORMAT)
    expect(screen.getByLabelText('Start date')).toHaveValue(startDate)

    const startTime = format(new Date(schedule.start), INPUT_TIME_FORMAT)
    expect(screen.getByLabelText('Start time')).toHaveValue(startTime)

    const min = screen.getByTestId('min-attendees').querySelector('input')
    expect(min).toHaveValue(course.min_participants)

    const max = screen.getByTestId('max-attendees').querySelector('input')
    expect(max).toHaveValue(course.max_participants)
  })

  it('calculates account code based on start date', async () => {
    setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    act(() => {
      screen.getByLabelText('Start date').focus()
    })

    await userEvent.paste('12/05/2022')

    act(() => {
      screen.getByLabelText('Start time').focus()
    })

    await userEvent.paste('09:00 AM')

    await waitFor(() => {
      expect(screen.getByText('810A May22')).toBeInTheDocument()
    })
  })

  it('shows an info alert for level 1 course', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.CLOSED} />)
    })

    const level = screen.getByTestId('course-level-select')
    expect(level.querySelector('input')).toHaveValue(CourseLevel.Level_1)

    await waitFor(() => {
      expect(screen.getByText(levelOneInfoMessage)).toBeInTheDocument()
    })
  })

  it('hides the info alert for level 2 course', async () => {
    await waitFor(() => render(<CourseForm type={CourseType.CLOSED} />))
    await selectLevel(CourseLevel.Level_2)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('hides the info alert for intermediate trainer course', async () => {
    await waitFor(() => render(<CourseForm type={CourseType.CLOSED} />))
    await selectLevel(CourseLevel.IntermediateTrainer)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('hides the info alert for advanced trainer course', async () => {
    await waitFor(() => render(<CourseForm type={CourseType.CLOSED} />))
    await selectLevel(CourseLevel.AdvancedTrainer)

    expect(screen.queryByText(levelOneInfoMessage)).not.toBeInTheDocument()
  })

  it('shows an info alert for blended learning for indirect courses', async () => {
    await waitFor(() => {
      render(<CourseForm type={CourseType.INDIRECT} />)
    })

    await userEvent.click(screen.getByLabelText('Blended learning'))

    await waitFor(() => {
      expect(screen.getByText(blendedLearningInfoMessage)).toBeInTheDocument()
    })
  })
})
