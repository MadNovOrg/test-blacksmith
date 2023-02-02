import { setMedia } from 'mock-match-media'
import React from 'react'
import { getI18n } from 'react-i18next'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { FilterDates } from './FilterDates'

const { t } = getI18n()
const errors = {
  endDateBeforeStartDate: t(
    'components.filter-dates.validation.end-date-before-start-date'
  ),
  startDateAfterEndDate: t(
    'components.filter-dates.validation.start-date-after-end-date'
  ),
  invalidDate: t('components.filter-dates.validation.invalid-date'),
}

describe('component: FilterDates', () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

  it('calls onChange as expected when from changes', async () => {
    const onChange = jest.fn()
    render(<FilterDates onChange={onChange} title={'Filter by Date'} />)

    const from = screen.getByLabelText('From')

    userEvent.paste(from, '30/05/2022')
    expect(from).toHaveValue('30/05/2022')

    expect(onChange).toHaveBeenCalledWith(
      new Date('2022-05-30T00:00:00'),
      undefined
    )
  })

  it('calls onChange as expected when to changes', async () => {
    const onChange = jest.fn()
    render(<FilterDates onChange={onChange} title={'Filter by Date'} />)

    const to = screen.getByLabelText('To')

    userEvent.paste(to, '30/05/2022')
    expect(to).toHaveValue('30/05/2022')

    expect(onChange).toHaveBeenCalledWith(
      undefined,
      new Date('2022-05-30T00:00:00')
    )
  })

  it('shows an error if the "to" date is before the "from" date or vice-versa', async () => {
    const onChange = jest.fn()
    render(<FilterDates onChange={onChange} title={'Filter by Date'} />)

    const from = screen.getByLabelText('From')
    userEvent.paste(from, '30/07/2024')
    expect(from).toHaveValue('30/07/2024')

    const dateFrom = screen.getByTestId('DateFrom')
    expect(
      within(dateFrom).queryByText(errors.startDateAfterEndDate)
    ).not.toBeInTheDocument()

    const dateTo = screen.getByTestId('DateTo')
    expect(
      within(dateTo).queryByText(errors.endDateBeforeStartDate)
    ).not.toBeInTheDocument()

    const to = screen.getByLabelText('To')
    userEvent.paste(to, '15/05/2022')
    expect(to).toHaveValue('15/05/2022')

    await waitFor(() => {
      expect(
        within(dateFrom).getByText(errors.startDateAfterEndDate)
      ).toBeInTheDocument()
      expect(
        within(dateTo).getByText(errors.endDateBeforeStartDate)
      ).toBeInTheDocument()
    })

    expect(onChange).toHaveBeenCalledWith(
      new Date('2024-07-30T00:00:00'),
      undefined
    )
  })

  it('shows an error if the "from" date is invalid', async () => {
    const onChange = jest.fn()
    render(<FilterDates onChange={onChange} title={'Filter by Date'} />)

    const dateFrom = screen.getByTestId('DateFrom')
    expect(
      within(dateFrom).queryByText(errors.invalidDate)
    ).not.toBeInTheDocument()

    const from = screen.getByLabelText('From')
    userEvent.paste(from, '45/62/')
    expect(from).toHaveValue('45/62/')

    await waitFor(() => {
      expect(within(dateFrom).getByText(errors.invalidDate)).toBeInTheDocument()
    })

    expect(onChange).toHaveBeenCalledWith(undefined, undefined)
  })

  it('shows an error if the "to" date is invalid', async () => {
    const onChange = jest.fn()
    render(<FilterDates onChange={onChange} title={'Filter by Date'} />)

    const dateTo = screen.getByTestId('DateTo')
    expect(
      within(dateTo).queryByText(errors.invalidDate)
    ).not.toBeInTheDocument()

    const to = screen.getByLabelText('To')
    userEvent.paste(to, '88/')
    expect(to).toHaveValue('88/')

    await waitFor(() => {
      expect(within(dateTo).getByText(errors.invalidDate)).toBeInTheDocument()
    })

    expect(onChange).toHaveBeenCalledWith(undefined, undefined)
  })
})
