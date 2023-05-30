import React from 'react'

import { render, screen, userEvent, waitFor } from '@test/index'

import { FilterCourseLevel } from './index'

describe('component: FilterCourseLevel', () => {
  it('triggers onChange when course level = Advanced Trainer is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCourseLevel onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('Trainer Level')).toBeVisible()
    })

    await userEvent.click(screen.getByText('Trainer Level'))
    await userEvent.click(screen.getByText('Advanced Trainer'))

    expect(onChange).toHaveBeenCalledWith(['ADVANCED_TRAINER'])
  })
})
