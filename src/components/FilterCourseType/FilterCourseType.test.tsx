import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterCourseType } from './index'

describe('component: FilterCourseType', () => {
  it('triggers onChange when course type = closed is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCourseType onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Course Type'))
      userEvent.click(screen.getByText('Closed'))
    })

    expect(onChange).toHaveBeenCalledWith(['CLOSED'])
  })
})
