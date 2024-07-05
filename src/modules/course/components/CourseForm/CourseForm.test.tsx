import { format } from 'date-fns'
import { setMedia } from 'mock-match-media'

import { Course_Level_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'
import {
  courseToCourseInput,
  INPUT_DATE_FORMAT,
  INPUT_TIME_FORMAT,
} from '@app/util'

import { act, render, screen, userEvent, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { renderForm } from './test-utils'

import { CourseForm } from '.'

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

  it('displays organisation selector and booking contact user selector if course type is closed', async () => {
    await waitFor(() => {
      renderForm(Course_Type_Enum.Closed)
    })

    expect(screen.getByText('Org Selector')).toBeInTheDocument()
    expect(screen.getByTestId('user-selector')).toBeInTheDocument()
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
        },
      )
    })

    const level = screen.getByTestId('course-level-select')
    expect(level.querySelector('input')).toHaveValue(course.level)

    expect(screen.getByLabelText('Blended learning')).not.toBeChecked()
    expect(screen.getByLabelText('Reaccreditation')).not.toBeChecked()
    expect(screen.getByLabelText('Face to face')).toBeChecked()

    const startDate = format(new Date(schedule.start), INPUT_DATE_FORMAT)
    expect(screen.getByLabelText('Start date', { exact: false })).toHaveValue(
      startDate,
    )

    const startTime = format(new Date(schedule.start), INPUT_TIME_FORMAT)
    expect(screen.getByLabelText('Start time', { exact: false })).toHaveValue(
      startTime,
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
})
