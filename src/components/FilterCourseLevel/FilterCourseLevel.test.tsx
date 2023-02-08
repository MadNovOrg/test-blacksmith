import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterCourseLevel } from './index'

describe('component: FilterCourseLevel', () => {
  it('triggers onChange when course level = Advanced Trainer is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCourseLevel onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Level'))
      userEvent.click(screen.getByText('Advanced Trainer'))
    })

    expect(onChange).toHaveBeenCalledWith(['ADVANCED_TRAINER'])
  })
})
