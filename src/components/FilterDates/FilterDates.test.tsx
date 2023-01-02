import { setMedia } from 'mock-match-media'
import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterDates } from './FilterDates'

describe('component: FilterDates', () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

  it('calls onChange as expected when from changes', async () => {
    const onChange = jest.fn()
    render(<FilterDates onChange={onChange} />)

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
    render(<FilterDates onChange={onChange} />)

    const to = screen.getByLabelText('To')

    userEvent.paste(to, '30/05/2022')
    expect(to).toHaveValue('30/05/2022')

    expect(onChange).toHaveBeenCalledWith(
      undefined,
      new Date('2022-05-30T00:00:00')
    )
  })
})
